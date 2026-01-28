import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMinecraftItemDTO, CreateModelDTO } from './dto/admin.dto';
import { rm } from 'fs/promises';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async removeAsset(id: string) {
    await rm(`uploads/${id}`);
  }

  async getMinecraftItems() {
    return await this.prisma.minecraftItem.findMany();
  }

  async createMinecraftItem(data: CreateMinecraftItemDTO, asset_id: string) {
    await this.prisma.minecraftItem.create({
      data: { name: data.name, str_id: data.str_id, resource_id: asset_id },
    });
  }

  async updateMinecraftItem(
    id: string,
    data: CreateMinecraftItemDTO,
    asset_id: string,
  ) {
    const item = await this.prisma.minecraftItem.findUniqueOrThrow({
      where: { id: parseInt(id) },
    });

    await this.prisma.minecraftItem.update({
      where: { id: item.id },
      data: { name: data.name, str_id: data.str_id, resource_id: asset_id },
    });
    try {
      await this.removeAsset(item.resource_id);
    } catch (e) {
      console.error('Cannot delete asset with id ', item.resource_id, ': ', e);
    }
  }

  async deleteMinecraftItem(id: string) {
    const item = await this.prisma.minecraftItem.findUniqueOrThrow({
      where: { id: parseInt(id) },
    });
    await this.removeAsset(item.resource_id);
    await this.prisma.minecraftItem.delete({ where: { id: item.id } });
  }

  async createSeason(name: string) {
    const existed = await this.prisma.season.findFirst({
      where: { name },
    });

    if (existed) return existed.id;
    const created = await this.prisma.season.create({
      data: { name },
    });

    return created.id;
  }

  async createCategories(categories: string[]) {
    const existing = await this.prisma.category.findMany({
      where: { name: { in: categories } },
    });

    const existingNames = new Set(existing.map(c => c.name));
    const toCreate = categories.filter(name => !existingNames.has(name));

    const created = await Promise.all(
      toCreate.map(name => this.prisma.category.create({ data: { name } })),
    );

    return [...existing.map(c => c.id), ...created.map(c => c.id)];
  }

  async createModel(body: CreateModelDTO, asset_id: string) {
    await this.prisma.costume.create({
      data: {
        name: body.name,
        seasonId: await this.createSeason(body.season),
        MinecraftItem: { connect: body.minecraftItem.map(i => ({ id: i })) },
        Category: {
          connect: (await this.createCategories(body.category)).map(i => ({
            id: i,
          })),
        },
        Gltf: { create: { resource_id: asset_id, meta: body.gltfMeta } },
      },
    });
  }
}
