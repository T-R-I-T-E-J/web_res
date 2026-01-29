import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import {
  CreateCategoryDto,
  UpdateCategoryDto,
} from './dto/create-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  create(createCategoryDto: CreateCategoryDto) {
    const category = this.categoryRepository.create(createCategoryDto);
    return this.categoryRepository.save(category);
  }

  findAll(page?: string) {
    const where = page ? { page, isActive: true } : { isActive: true };
    return this.categoryRepository.find({
      where,
      order: { order: 'ASC' },
    });
  }

  findOne(id: string) {
    return this.categoryRepository.findOne({ where: { id } });
  }

  update(id: string, updateCategoryDto: UpdateCategoryDto) {
    return this.categoryRepository.update(id, updateCategoryDto);
  }

  async remove(id: string) {
    try {
      const result = await this.categoryRepository.delete(id);

      if (result.affected === 0) {
        throw new Error('Category not found');
      }

      return { success: true, message: 'Category deleted successfully' };
    } catch (error) {
      // Handle foreign key constraint violation
      const dbError = error as { code?: string };
      if (dbError.code === '23503') {
        throw new Error(
          'Cannot delete category because it is being used by one or more downloads. Please reassign or delete those downloads first.',
        );
      }
      throw error;
    }
  }
}
