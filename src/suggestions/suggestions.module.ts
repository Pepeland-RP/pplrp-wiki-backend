import { Module } from '@nestjs/common';
import { SuggestionsController } from './suggestions.controller';
import { SuggestionsService } from './suggestions.service';
import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from 'src/auth/auth.service';

@Module({
  controllers: [SuggestionsController],
  providers: [SuggestionsService, PrismaService, AuthService],
})
export class SuggestionsModule {}
