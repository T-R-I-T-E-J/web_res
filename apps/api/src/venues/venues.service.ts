import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { Venue } from './entities/venue.entity.js';
import { CreateVenueDto } from './dto/create-venue.dto.js';
import { UpdateVenueDto } from './dto/update-venue.dto.js';

@Injectable()
export class VenuesService {
  constructor(
    @InjectRepository(Venue)
    private readonly venuesRepository: Repository<Venue>,
  ) {}

  /**
   * Create a new venue
   */
  async create(createVenueDto: CreateVenueDto): Promise<Venue> {
    if (createVenueDto.code) {
      const existing = await this.venuesRepository.findOne({
        where: { code: createVenueDto.code },
      });
      if (existing) {
        throw new ConflictException('Venue code already exists');
      }
    }

    const venue = this.venuesRepository.create(createVenueDto);
    return this.venuesRepository.save(venue);
  }

  /**
   * Find all venues
   */
  async findAll(activeOnly: boolean = true): Promise<Venue[]> {
    if (activeOnly) {
      return this.venuesRepository.find({
        where: { is_active: true },
        order: { name: 'ASC' },
      });
    }
    return this.venuesRepository.find({
      order: { name: 'ASC' },
    });
  }

  /**
   * Find a venue by ID
   */
  async findOne(id: number): Promise<Venue> {
    const venue = await this.venuesRepository.findOne({ where: { id } });
    if (!venue) {
      throw new NotFoundException(`Venue with ID ${id} not found`);
    }
    return venue;
  }

  /**
   * Update a venue
   */
  async update(id: number, updateVenueDto: UpdateVenueDto): Promise<Venue> {
    if (updateVenueDto.code) {
      const existing = await this.venuesRepository.findOne({
        where: { code: updateVenueDto.code, id: Not(id) },
      });
      if (existing) {
        throw new ConflictException('Venue code already in use');
      }
    }

    const venue = await this.findOne(id);
    this.venuesRepository.merge(venue, updateVenueDto);
    return this.venuesRepository.save(venue);
  }

  /**
   * Delete a venue
   */
  async remove(id: number): Promise<void> {
    const venue = await this.findOne(id);
    try {
      await this.venuesRepository.remove(venue);
    } catch {
      throw new ConflictException(
        'Cannot delete venue as it might be used in competitions',
      );
    }
  }
}
