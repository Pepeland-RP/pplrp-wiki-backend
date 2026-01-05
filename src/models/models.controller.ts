import { Controller, Get, Query } from '@nestjs/common';
import { ModelsService } from './models.service';
import { ModelSearchQueryDTO } from './dto/query.dto';

@Controller('models')
export class ModelsController {
  constructor(private readonly costumesService: ModelsService) {}

  @Get()
  async findAll(@Query() query: ModelSearchQueryDTO) {
    return await this.costumesService.findAll(query);
  }

  @Get('filters')
  async getFilterParams() {
    return await this.costumesService.getFilterParams();
  }

  /*
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
  */
}
