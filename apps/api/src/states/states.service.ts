import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { StateAssociation } from './entities/state-association.entity.js';
import { CreateStateDto } from './dto/create-state.dto.js';
import { UpdateStateDto } from './dto/update-state.dto.js';

@Injectable()
export class StatesService {
  constructor(
    @InjectRepository(StateAssociation)
    private readonly statesRepository: Repository<StateAssociation>,
  ) {}

  /**
   * Create a new state association
   */
  async create(createStateDto: CreateStateDto): Promise<StateAssociation> {
    const existingCode = await this.statesRepository.findOne({
      where: { code: createStateDto.code },
    });
    if (existingCode) {
      throw new ConflictException('State code already exists');
    }

    const state = this.statesRepository.create(createStateDto);
    return this.statesRepository.save(state);
  }

  /**
   * Find all states
   */
  async findAll(activeOnly: boolean = true): Promise<StateAssociation[]> {
    if (activeOnly) {
      return this.statesRepository.find({
        where: { is_active: true },
        order: { name: 'ASC' },
      });
    }
    return this.statesRepository.find({
      order: { name: 'ASC' },
    });
  }

  /**
   * Find a state by ID
   */
  async findOne(id: number): Promise<StateAssociation> {
    const state = await this.statesRepository.findOne({ where: { id } });
    if (!state) {
      throw new NotFoundException(`State with ID ${id} not found`);
    }
    return state;
  }

  /**
   * Update a state
   */
  async update(
    id: number,
    updateStateDto: UpdateStateDto,
  ): Promise<StateAssociation> {
    // Check if code is being changed and if it conflicts
    if (updateStateDto.code) {
      const existing = await this.statesRepository.findOne({
        where: { code: updateStateDto.code, id: Not(id) },
      });
      if (existing) {
        throw new ConflictException('State code already in use');
      }
    }

    const state = await this.findOne(id);
    this.statesRepository.merge(state, updateStateDto);
    return this.statesRepository.save(state);
  }

  /**
   * Delete a state (Hard delete)
   */
  async remove(id: number): Promise<void> {
    const state = await this.findOne(id);
    try {
      await this.statesRepository.remove(state);
    } catch {
      throw new ConflictException(
        'Cannot delete state as it has related records',
      );
    }
  }
}
