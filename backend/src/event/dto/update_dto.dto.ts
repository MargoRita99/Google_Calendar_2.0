import { PartialType } from '@nestjs/mapped-types';
import { CreateEventDto } from 'src/event/dto/event.dto';

export class UpdateEventDto extends PartialType(CreateEventDto) {}