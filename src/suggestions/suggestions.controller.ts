import {
  Body,
  Controller,
  Get,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { SuggestionsService } from './suggestions.service';
import { CreateSuggestionDTO } from './dto/create.dto';
import { rm } from 'fs/promises';
import { Throttle } from '@nestjs/throttler';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Auth } from 'src/auth/guards/auth.decorator';
import { GetAllSuggestionsDTO } from './dto/query.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 } from 'uuid';

const UploadInterceptor = () =>
  FilesInterceptor('file', 10, {
    storage: diskStorage({
      destination: 'uploads',
      filename: (_, __, cb) => cb(null, v4()),
    }),
  });

@Controller('suggestions')
@UseGuards(AuthGuard)
export class SuggestionsController {
  constructor(private readonly suggestionsService: SuggestionsService) {}

  @Post('')
  @UseInterceptors(UploadInterceptor())
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  async createSuggestion(
    @Body() body: CreateSuggestionDTO,
    @UploadedFiles(
      new ParseFilePipe({
        fileIsRequired: false,
        validators: [new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 })],
      }),
    )
    files: Express.Multer.File[],
  ) {
    try {
      await this.suggestionsService.createSuggestion(body, files);
    } catch (e) {
      if (files) await Promise.all([files.map(f => rm(f.path))]);
      throw e;
    }
  }

  @Get()
  @Auth()
  async getAllSuggestions(@Query() query: GetAllSuggestionsDTO) {
    return this.suggestionsService.getAllSuggestions(
      query.page ?? 0,
      query.take ?? 20,
    );
  }
}
