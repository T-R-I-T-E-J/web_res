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

  create(createEventDto: CreateEventDto) {
    const event = this.eventsRepository.create(createEventDto);
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
