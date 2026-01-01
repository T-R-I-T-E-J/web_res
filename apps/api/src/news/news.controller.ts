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
  BadRequestException,
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
    try {
      console.log('Create News Request:');
      console.log('User:', req.user);
      console.log('Payload:', JSON.stringify(createNewsDto));

      const authorId = req.user?.id ? Number(req.user.id) : 2; // Default to 2 (Admin) if missing
      return this.newsService.create(createNewsDto, authorId);
    } catch (error) {
      console.error('Error creating news:', error);
      // Throw 400 to bypass potential 500 filters and see the real message in UI
      const err = error as Error;
      throw new BadRequestException(
        `DEBUG ERROR: ${err.message} (Stack: ${err.stack?.substring(0, 100)})`,
      );
    }
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
