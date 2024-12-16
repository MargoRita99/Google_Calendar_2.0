import { PartialType } from '@nestjs/mapped-types';
import { CreateCalendarDto } from './calendar.dto';

export class UpdateCalendarDto extends PartialType(CreateCalendarDto) {}