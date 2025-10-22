import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateModelDto } from './dto/create-model.dto';

@Injectable()
export class ModelsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const costumes = await this.prisma.costume.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        Season: true,
        Category: true,
        Gltf: true,
        MinecraftItem: true,
      },
    });

    return costumes.map(costume => ({
      id: costume.id,
      name: costume.name,
      category: costume.Category.map(el => ({ name: el.name })),
      season: costume.Season
        ? {
            name: costume.Season.name,
            icon: costume.Season.icon,
          }
        : null,
      acceptable_items: costume.MinecraftItem.map(item => ({
        name: item.name,
        texture_id: item.resource_id,
      })),
      gltf: costume.Gltf
        ? {
            resource_id: costume.Gltf.resource_id,
            meta: costume.Gltf.meta,
          }
        : null,
    }));
  }

  // TODO: Refactor this
  async create(createCostumeDto: CreateModelDto, file: Express.Multer.File) {
    //const imageUrl = `http://localhost:${process.env.PORT}/uploads/${file.filename}`;

    return this.prisma.costume.create({
      data: {
        name: createCostumeDto.name,
      },
    });
  }
}
