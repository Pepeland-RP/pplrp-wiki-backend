import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCostumeDto } from './dto/create-costume.dto';

@Injectable()
export class CostumesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.costume.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  // TODO: Refactor this
  async create(createCostumeDto: CreateCostumeDto, file: Express.Multer.File) {
    const imageUrl = `http://localhost:${process.env.PORT}/uploads/${file.filename}`;

    return this.prisma.costume.create({
      data: {
        name: createCostumeDto.name,
        image: imageUrl,
      },
    });
  }
}
