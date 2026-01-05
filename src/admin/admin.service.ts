import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMinecraftItemDTO } from './dto/admin.dto';
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
}
