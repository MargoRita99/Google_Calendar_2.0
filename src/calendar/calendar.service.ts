import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Calendar } from './calendar.entity';
import { CreateCalendarDto } from 'src/calendar/dto/calendar.dto';
import { UpdateCalendarDto } from 'src/calendar/dto/update_calendar.dto';

@Injectable()
export class CalendarService {
  constructor(
    @InjectRepository(Calendar)
    private calendarRepository: Repository<Calendar>,
  ) {}

  create(createCalendarDto: CreateCalendarDto) {
    const calendar = this.calendarRepository.create(createCalendarDto);
    return this.calendarRepository.save(calendar);
  }

  findAll() {
    return this.calendarRepository.find();
  }

  findOne(id: number) {
    return this.calendarRepository.findOneOrFail({ where: {id}});
  }

  update(id: number, updateCalendarDto: UpdateCalendarDto) {
    return this.calendarRepository.update(id, updateCalendarDto);
  }

  remove(id: number) {
    return this.calendarRepository.delete(id);
  }
}