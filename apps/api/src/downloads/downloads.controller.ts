import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { DownloadsService } from './downloads.service';
import { CreateDownloadDto } from './dto/create-download.dto';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('downloads')
export class DownloadsController {
  constructor(private readonly downloadsService: DownloadsService) {}

  @Post()
  @Roles('admin', 'super_admin') // Use string roles if enum is strict, likely 'admin'
  create(@Body() createDownloadDto: CreateDownloadDto) {
    return this.downloadsService.create(createDownloadDto);
  }

  @Public()
  @Get('categories')
  getCategories() {
    return this.downloadsService.getCategories();
  }

  @Public()
  @Get()
  findAll(@Query('category') category?: string) {
    return this.downloadsService.findAll(category);
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.downloadsService.findOne(id);
  }

  @Delete(':id')
  @Roles('admin', 'super_admin')
  remove(@Param('id') id: string) {
    return this.downloadsService.remove(id);
  }
}
