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
import { ModelsService } from './models.service';
import { CreateModelDto } from './dto/create-model.dto';

@Controller('models')
export class ModelsController {
  constructor(private readonly costumesService: ModelsService) {}

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
    @Body() createCostumeDto: CreateModelDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.costumesService.create(createCostumeDto, file);
  }
}
