import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ModelSearchQueryDTO } from './dto/query.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ModelsService {
  constructor(private prisma: PrismaService) {}

  buildCostumeSearchQuery = (dto: ModelSearchQueryDTO) => {
    const { search, seasons, categories, page = 0, take = 20 } = dto;

    const where: Prisma.CostumeWhereInput = {
      ...(search && {
        name: {
          contains: search,
        },
      }),

      ...(seasons?.length && {
        seasonId: {
          in: seasons,
        },
      }),

      ...(categories?.length && {
        AND: categories.map(categoryId => ({
          Category: {
            some: {
              id: categoryId,
            },
          },
        })),
      }),
    };

    return {
      where,
      skip: page * take,
      take,
      orderBy: {
        createdAt: Prisma.SortOrder.desc,
      },
      include: {
        Season: true,
        Category: true,
        MinecraftItem: true,
        Gltf: true,
      },
    };
  };

  async findAll(query: ModelSearchQueryDTO) {
    const costumes = await this.prisma.costume.findMany(
      this.buildCostumeSearchQuery(query),
    );

    console.log(this.buildCostumeSearchQuery(query).where, query);

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

  async getFilterParams() {
    const seasons = await this.prisma.season.findMany();
    const categories = await this.prisma.category.findMany();

    return {
      seasons: seasons.map(season => ({ id: season.id, name: season.name })),
      categories: categories.map(category => ({
        id: category.id,
        name: category.name,
      })),
    };
  }
  /*

  // TODO: Refactor this
  async create(createCostumeDto: CreateModelDto, file: Express.Multer.File) {
    //const imageUrl = `http://localhost:${process.env.PORT}/uploads/${file.filename}`;

    return this.prisma.costume.create({
      data: {
        name: createCostumeDto.name,
      },
    });
  }
    */
}
