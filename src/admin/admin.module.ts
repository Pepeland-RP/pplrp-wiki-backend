import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { AuthService } from 'src/auth/auth.service';

@Module({
  controllers: [AdminController],
  providers: [AdminService, PrismaService, AuthService],
})
export class AdminModule {}
