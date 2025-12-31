import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NewsArticle, NewsStatus } from './entities/news.entity.js';
import { CreateNewsDto } from './dto/create-news.dto.js';
import { UpdateNewsDto } from './dto/update-news.dto.js';

@Injectable()
export class NewsService {
  constructor(
    @InjectRepository(NewsArticle)
    private readonly newsRepository: Repository<NewsArticle>,
  ) {}

  async create(
    createNewsDto: CreateNewsDto,
    authorId: number,
  ): Promise<NewsArticle> {
    let slug = this.generateSlug(createNewsDto.title);

    // Check slug uniqueness
    let existing = await this.newsRepository.findOne({ where: { slug } });
    if (existing) {
      slug = `${slug}-${Date.now()}`; // Simple unique suffix
    }

    const news = this.newsRepository.create({
      ...createNewsDto,
      author_id: authorId,
      slug: slug,
      published_at:
        createNewsDto.status === NewsStatus.PUBLISHED ? new Date() : undefined,
    });

    return this.newsRepository.save(news);
  }

  async findAll(status?: NewsStatus): Promise<NewsArticle[]> {
    const query = this.newsRepository
      .createQueryBuilder('news')
      .leftJoinAndSelect('news.author', 'author')
      .where('news.deleted_at IS NULL')
      .orderBy('news.created_at', 'DESC');

    if (status) {
      query.andWhere('news.status = :status', { status });
    }

    return query.getMany();
  }

  async findPublished(): Promise<NewsArticle[]> {
    return this.newsRepository.find({
      where: { status: NewsStatus.PUBLISHED },
      relations: ['author'],
      order: { is_pinned: 'DESC', published_at: 'DESC' },
      take: 10, // Limit to 10 for "Latest News" usually
    });
  }

  async findOne(id: number): Promise<NewsArticle> {
    const news = await this.newsRepository.findOne({
      where: { id },
      relations: ['author'],
    });
    if (!news) {
      throw new NotFoundException(`News article with ID ${id} not found`);
    }
    return news;
  }

  async findOneBySlug(slug: string): Promise<NewsArticle> {
    const news = await this.newsRepository.findOne({
      where: { slug },
      relations: ['author'],
    });
    if (!news) {
      throw new NotFoundException(`News article with slug ${slug} not found`);
    }
    return news;
  }

  async update(id: number, updateNewsDto: UpdateNewsDto): Promise<NewsArticle> {
    const news = await this.findOne(id);

    if (
      updateNewsDto.status === NewsStatus.PUBLISHED &&
      news.status !== NewsStatus.PUBLISHED
    ) {
      news.published_at = new Date();
    }

    // If title updates, we *could* update slug but that breaks URLs. Keeping slug static for now unless explicitly requested.

    Object.assign(news, updateNewsDto);
    return this.newsRepository.save(news);
  }

  async remove(id: number): Promise<void> {
    const result = await this.newsRepository.softDelete(id);
    if (result.affected === 0) {
      // Check if it exists but is already deleted
      const exists = await this.newsRepository.findOne({
        where: { id },
        withDeleted: true,
      });
      if (exists && exists.deleted_at) {
        return; // Already deleted, consider success
      }
      throw new NotFoundException(`News article with ID ${id} not found`);
    }
  }

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
}
