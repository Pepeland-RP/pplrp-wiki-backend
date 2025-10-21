import { Module } from '@nestjs/common';
import { CostumesController } from './costumes.controller';
import { CostumesService } from './costumes.service';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [CostumesController],
  providers: [CostumesService, PrismaService],
})
export class CostumesModule {}
