import {
  Controller,
  Get,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { CostumesService } from './costumes.service';
import { CreateCostumeDto } from './dto/create-costume.dto';

@Controller('costumes')
export class CostumesController {
  constructor(private readonly costumesService: CostumesService) {}

  @Get()
  async findAll() {
    return await this.costumesService.findAll();
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueSuffix + extname(file.originalname));
        },
      }),
    }),
  )
  async create(
    @Body() createCostumeDto: CreateCostumeDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.costumesService.create(createCostumeDto, file);
  }
}
