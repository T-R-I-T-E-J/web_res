import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { DisabilityCategory } from './entities/disability-category.entity.js';
import { CreateDisabilityCategoryDto } from './dto/create-disability-category.dto.js';
import { UpdateDisabilityCategoryDto } from './dto/update-disability-category.dto.js';

@Injectable()
export class DisabilityCategoriesService {
  constructor(
    @InjectRepository(DisabilityCategory)
    private readonly categoriesRepository: Repository<DisabilityCategory>,
  ) {}

  /**
   * Create a new category
   */
  async create(
    createDto: CreateDisabilityCategoryDto,
  ): Promise<DisabilityCategory> {
    const existingCode = await this.categoriesRepository.findOne({
      where: { code: createDto.code },
    });
    if (existingCode) {
      throw new ConflictException('Category code already exists');
    }

    const category = this.categoriesRepository.create(createDto);
    return this.categoriesRepository.save(category);
  }

  /**
   * Find all categories
   */
  async findAll(activeOnly: boolean = true): Promise<DisabilityCategory[]> {
    if (activeOnly) {
      return this.categoriesRepository.find({
        where: { is_active: true },
        order: { code: 'ASC' },
      });
    }
    return this.categoriesRepository.find({
      order: { code: 'ASC' },
    });
  }

  /**
   * Find a category by ID
   */
  async findOne(id: number): Promise<DisabilityCategory> {
    const category = await this.categoriesRepository.findOne({ where: { id } });
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return category;
  }

  /**
   * Update a category
   */
  async update(
    id: number,
    updateDto: UpdateDisabilityCategoryDto,
  ): Promise<DisabilityCategory> {
    if (updateDto.code) {
      const existing = await this.categoriesRepository.findOne({
        where: { code: updateDto.code, id: Not(id) },
      });
      if (existing) {
        throw new ConflictException('Category code already in use');
      }
    }

    const category = await this.findOne(id);
    this.categoriesRepository.merge(category, updateDto);
    return this.categoriesRepository.save(category);
  }

  /**
   * Delete a category
   */
  async remove(id: number): Promise<void> {
    const category = await this.findOne(id);
    try {
      await this.categoriesRepository.remove(category);
    } catch {
      throw new ConflictException(
        'Cannot delete category as it is being used by shooters',
      );
    }
  }
}
