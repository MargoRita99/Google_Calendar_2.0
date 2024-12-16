import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { GoogleService } from 'src/google/google.service'; // Сервис для работы с Google API
import { UserService } from 'src/user/user.service'; // Сервис для работы с пользователями
import { InjectRepository } from '@nestjs/typeorm';
import { Event } from 'src/event/event.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SyncService {
  private readonly logger = new Logger(SyncService.name);

  constructor(
    private readonly googleService: GoogleService,
    private readonly userService: UserService, // Для получения пользователей с Google токенами
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
  ) {}

  // Запуск каждую минуту
  @Cron(CronExpression.EVERY_MINUTE)
  async syncGoogleCalendars() {
    this.logger.log('Starting calendar synchronization...');

    // Получаем всех пользователей из базы
    const users = await this.userService.getUsersWithGoogleTokens();

    for (const user of users) {
      try {
        // Получение событий из Google Calendar
        const googleEvents = await this.googleService.getEvents(user.tokens);

        // Синхронизация событий (логика обновления/добавления в БД)
        await this.syncEvents(user.id, googleEvents);

        this.logger.log(`Successfully synced events for user ${user.email}`);
      } catch (error) {
        this.logger.error(`Error syncing events for user ${user.email}`, error.stack);
      }
    }
  }

  private async syncEvents(userId: number, googleEvents: any[]) {
    for (const event of googleEvents) {
      const existingEvent = await this.eventRepository.findOne({
        where: { googleEventId: event.id, user: { id: userId } },
      });
  
      if (existingEvent) {
        // Обновление существующего события
        existingEvent.title = event.summary;
        existingEvent.startDate = new Date(event.start.dateTime || event.start.date);
        existingEvent.endDate = new Date(event.end.dateTime || event.end.date);
        await this.eventRepository.save(existingEvent);
      } else {
        // Добавление нового события
        const newEvent = this.eventRepository.create({
          title: event.summary,
          startDate: new Date(event.start.dateTime || event.start.date),
          endDate: new Date(event.end.dateTime || event.end.date),
          user: { id: userId },
          googleEventId: event.id,
        });
        await this.eventRepository.save(newEvent);
      }
    }
  }
  
}