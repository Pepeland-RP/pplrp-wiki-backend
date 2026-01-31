import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSuggestionDTO } from './dto/create.dto';

@Injectable()
export class SuggestionsService {
  constructor(private prisma: PrismaService) {}

  async createSuggestion(
    data: CreateSuggestionDTO,
    files?: Express.Multer.File[],
  ) {
    await this.prisma.$transaction(async tx => {
      const suggestion = await tx.suggestions.create({
        data: { nickname: data.nickname, content: data.content },
      });

      if (files && files.length !== 0) {
        await tx.suggestionImage.createMany({
          data: files.map(f => ({
            resource_id: f.filename,
            suggestionId: suggestion.id,
          })),
        });
      }

      if (data.links.length !== 0) {
        await tx.suggestionLink.createMany({
          data: data.links.map(l => ({
            content: l,
            suggestionId: suggestion.id,
          })),
        });
      }
    });
  }

  async getAllSuggestions(page: number, take: number) {
    const suggestions = await this.prisma.suggestions.findMany({
      take,
      skip: take * page,
      include: { images: true, links: true },
    });

    return suggestions.map(sug => ({
      nickname: sug.nickname,
      content: sug.content,
      created_at: sug.created_at,
      images: sug.images.map(i => ({ id: i.id, resource_id: i.resource_id })),
      links: sug.links.map(l => l.content),
    }));
  }
}
