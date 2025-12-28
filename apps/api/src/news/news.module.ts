import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NewsService } from './news.service.js';
import { NewsController } from './news.controller.js';
import { NewsArticle } from './entities/news.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([NewsArticle])],
  controllers: [NewsController],
  providers: [NewsService],
  exports: [NewsService],
})
export class NewsModule {}
