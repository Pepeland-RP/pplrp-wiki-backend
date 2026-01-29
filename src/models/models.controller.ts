import { Controller, Get, Param, Query } from '@nestjs/common';
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

  @Get(':id')
  async findOne(@Param('id') param: string) {
    return await this.costumesService.getOne(param);
  }
}
