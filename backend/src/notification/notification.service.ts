import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './notification.entity';
import { Event } from 'src/event/event.entity';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
  ) {}

  async createNotification(event: Event, notifyAt: Date): Promise<Notification> {
    const notification = this.notificationRepository.create({
      event,
      notifyAt,
    });
    return await this.notificationRepository.save(notification);
  }

  async findByEvent(eventId: number): Promise<Notification[]> {
    return await this.notificationRepository.find({
      where: { event: { id: eventId } },
      relations: ['event'],
    });
  }

  async findPendingNotifications(currentDate: Date): Promise<Notification[]> {
    return await this.notificationRepository.find({
      where: { notifyAt: currentDate, isSent: false },
      relations: ['event'],
    });
  }


  async markAsSent(notificationId: number): Promise<Notification> {
    const notification = await this.notificationRepository.findOneOrFail({
      where: { id: notificationId },
    });
    notification.isSent = true;
    return await this.notificationRepository.save(notification);
  }


  async deleteNotification(notificationId: number): Promise<void> {
    await this.notificationRepository.delete(notificationId);
  }
}