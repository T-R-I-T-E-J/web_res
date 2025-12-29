import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MediaService } from './media.service.js';
import { MediaController } from './media.controller.js';
import { MediaItem } from './entities/media.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([MediaItem])],
  controllers: [MediaController],
  providers: [MediaService],
  exports: [MediaService],
})
export class MediaModule {}
