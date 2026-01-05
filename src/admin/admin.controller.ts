import {
  Body,
  Controller,
  Delete,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Auth } from 'src/auth/guards/auth.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 } from 'uuid';
import { rm } from 'fs/promises';
import { CreateMinecraftItemDTO } from './dto/admin.dto';

const UploadInterceptor = () =>
  FileInterceptor('file', {
    storage: diskStorage({
      destination: 'uploads',
      filename: (_, __, cb) => cb(null, v4()),
    }),
  });

const ValidationPipe = new ParseFilePipe({
  fileIsRequired: true,
  validators: [new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 })],
});

@Controller('admin')
@UseGuards(AuthGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('items')
  async getAllItems() {
    return await this.adminService.getMinecraftItems();
  }

  @Post('items')
  @Auth()
  @UseInterceptors(UploadInterceptor())
  async createItem(
    @Body() body: CreateMinecraftItemDTO,
    @UploadedFile(ValidationPipe)
    file: Express.Multer.File,
  ) {
    try {
      await this.adminService.createMinecraftItem(body, file.filename);
    } catch (e) {
      await rm(file.path);
      throw e;
    }
  }

  @Put('items/:id')
  @Auth()
  @UseInterceptors(UploadInterceptor())
  async updateItem(
    @Param('id') id: string,
    @Body() body: CreateMinecraftItemDTO,
    @UploadedFile(ValidationPipe)
    file: Express.Multer.File,
  ) {
    try {
      await this.adminService.updateMinecraftItem(id, body, file.filename);
    } catch (e) {
      await rm(file.path);
      throw e;
    }
  }

  @Delete('items/:id')
  @Auth()
  async deleteItem(@Param('id') id: string) {
    await this.adminService.deleteMinecraftItem(id);
  }
}
