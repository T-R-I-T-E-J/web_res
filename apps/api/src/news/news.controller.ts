import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  Request,
} from '@nestjs/common';
import { NewsService } from './news.service.js';
import { CreateNewsDto } from './dto/create-news.dto.js';
import { UpdateNewsDto } from './dto/update-news.dto.js';

import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Public } from '../auth/decorators/public.decorator.js';
import { NewsStatus } from './entities/news.entity.js';

@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles('admin', 'system_admin')
  create(@Body() createNewsDto: CreateNewsDto, @Request() req: any) {
    return this.newsService.create(createNewsDto, req.user.id);
  }

  @Get()
  @Public()
  findAll(@Query('status') status?: NewsStatus) {
    return this.newsService.findAll(status);
  }

  @Get('latest')
  @Public()
  findLatest() {
    return this.newsService.findPublished();
  }

  @Get(':id')
  @Public()
  findOne(@Param('id') id: string) {
    // Support finding by ID or Slug would be nice, but matching routing is tricky if both are root relative.
    // If I use 'latest' above, it handles that.
    // If :id is number, findByID. Else findBySlug.

    if (/^\d+$/.test(id)) {
      return this.newsService.findOne(+id);
    }
    return this.newsService.findOneBySlug(id);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles('admin', 'system_admin')
  update(@Param('id') id: string, @Body() updateNewsDto: UpdateNewsDto) {
    return this.newsService.update(+id, updateNewsDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('admin', 'system_admin')
  remove(@Param('id') id: string) {
    return this.newsService.remove(+id);
  }
}
