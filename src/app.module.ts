import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { CostumesModule } from './costumes/costumes.module';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [ConfigModule.forRoot(), CostumesModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
