import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMediaDto } from './dto/create-media.dto.js';
import { UpdateMediaDto } from './dto/update-media.dto.js';
import { MediaItem } from './entities/media.entity.js';

@Injectable()
export class MediaService {
  constructor(
    @InjectRepository(MediaItem)
    private mediaRepository: Repository<MediaItem>,
  ) {}

  create(createMediaDto: CreateMediaDto) {
    const item = this.mediaRepository.create(createMediaDto);
    return this.mediaRepository.save(item);
  }

  findAll(category?: string) {
    const query = this.mediaRepository.createQueryBuilder('media');
    if (category) {
      query.where('media.category = :category', { category });
    }
    return query.orderBy('media.created_at', 'DESC').getMany();
  }

  async findOne(id: number) {
    const item = await this.mediaRepository.findOne({ where: { id } });
    if (!item) throw new NotFoundException(`Media Item #${id} not found`);
    return item;
  }

  async update(id: number, updateMediaDto: UpdateMediaDto) {
    const item = await this.findOne(id);
    this.mediaRepository.merge(item, updateMediaDto);
    return this.mediaRepository.save(item);
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.mediaRepository.softDelete(id);
  }
}
