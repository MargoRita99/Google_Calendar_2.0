import { IsString, IsNotEmpty, IsOptional, IsDateString, IsBoolean } from 'class-validator';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  startDate: Date;

  @IsDateString()
  endDate: Date;

  @IsBoolean()
  @IsOptional()
  isRecurring?: boolean;

  @IsOptional()
  recurrenceRules?: { frequency: string; interval: number; byDay?: string[] };

  @IsOptional()
  calendarId?: number;
}