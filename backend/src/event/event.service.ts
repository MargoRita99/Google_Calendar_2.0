import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './event.entity';
import { CreateEventDto } from './dto/event.dto';
import { UpdateEventDto } from './dto/update_dto.dto';
import { User } from 'src/user/user.entity';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
  ) {}

  async findAll(userId: number): Promise<Event[]> {
    return this.eventRepository.find({
      where: { user: { id: userId } },
      relations: ['calendar', 'notifications'],
    });
  }

  async findOne(id: number, userId: number): Promise<Event> {
    const event = await this.eventRepository.findOne({
      where: { id, user: { id: userId } },
      relations: ['calendar', 'notifications'],
    });
    if (!event) throw new NotFoundException('Event not found');
    return event;
  }

  async create(userId: number, createEventDto: CreateEventDto): Promise<Event> {
    const event = this.eventRepository.create({
      ...createEventDto,
      user: { id: userId } as User,
    });
    return this.eventRepository.save(event);
  }

  async update(
    id: number,
    userId: number,
    updateEventDto: UpdateEventDto,
  ): Promise<Event> {
    const event = await this.findOne(id, userId);
    Object.assign(event, updateEventDto);
    return this.eventRepository.save(event);
  }

  async delete(id: number, userId: number): Promise<void> {
    const event = await this.findOne(id, userId);
    await this.eventRepository.remove(event);
  }
}