import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Event, EventStatus } from './entities/event.entity';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private eventsRepository: Repository<Event>,
  ) {}

  async create(createEventDto: CreateEventDto) {
    // Generate slug from title
    const baseSlug = createEventDto.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    
    // Ensure uniqueness
    let slug = baseSlug;
    let counter = 1;
    while (await this.eventsRepository.findOne({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
    
    const event = this.eventsRepository.create({
      ...createEventDto,
      slug,
    });
    return this.eventsRepository.save(event);
  }

  findAll(status?: string) {
    const query = this.eventsRepository.createQueryBuilder('event');
    if (status && Object.values(EventStatus).includes(status as EventStatus)) {
      query.where('event.status = :status', { status });
    }
    return query.orderBy('event.start_date', 'ASC').getMany();
  }

  async findOne(id: number) {
    const event = await this.eventsRepository.findOne({ where: { id } });
    if (!event) throw new NotFoundException(`Event #${id} not found`);
    return event;
  }

  async findOneBySlug(slug: string) {
    const event = await this.eventsRepository.findOne({ where: { slug } });
    if (!event) throw new NotFoundException(`Event with slug "${slug}" not found`);
    return event;
  }

  async update(id: number, updateEventDto: UpdateEventDto) {
    const event = await this.findOne(id);
    this.eventsRepository.merge(event, updateEventDto);
    return this.eventsRepository.save(event);
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.eventsRepository.softDelete(id);
  }
}
