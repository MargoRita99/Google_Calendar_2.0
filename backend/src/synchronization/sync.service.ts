import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { GoogleService } from 'src/google/google.service'; 
import { UserService } from 'src/user/user.service'; 
import { InjectRepository } from '@nestjs/typeorm';
import { Event } from 'src/event/event.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SyncService {
  private readonly logger = new Logger(SyncService.name);

  constructor(
    private readonly googleService: GoogleService,
    private readonly userService: UserService,
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async syncGoogleCalendars() {
    this.logger.log('Starting calendar synchronization...');

    const users = await this.userService.getUsersWithGoogleTokens();

    for (const user of users) {
      try {
        
        const googleEvents = await this.googleService.getEvents(user.tokens);

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
        
        existingEvent.title = event.summary;
        existingEvent.startDate = new Date(event.start.dateTime || event.start.date);
        existingEvent.endDate = new Date(event.end.dateTime || event.end.date);
        await this.eventRepository.save(existingEvent);
      } else {
        
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