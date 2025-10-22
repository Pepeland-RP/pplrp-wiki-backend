import { Module } from '@nestjs/common';
import { ModelsController } from './models.controller';
import { ModelsService } from './models.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [ModelsController],
  providers: [ModelsService, PrismaService],
})
export class ModelsModule {}
