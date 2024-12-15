import { IsString, IsOptional } from 'class-validator';

export class CreateCalendarDto {
  @IsString()
  name: string; // Название календаря

  @IsOptional()
  @IsString()
  description?: string; // Описание календаря

  @IsOptional()
  googleCalendarId?: string; // ID календаря в Google
}