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

  // Создать уведомление
  async createNotification(event: Event, notifyAt: Date): Promise<Notification> {
    const notification = this.notificationRepository.create({
      event,
      notifyAt,
    });
    return await this.notificationRepository.save(notification);
  }

  // Получить все уведомления для конкретного события
  async findByEvent(eventId: number): Promise<Notification[]> {
    return await this.notificationRepository.find({
      where: { event: { id: eventId } },
      relations: ['event'],
    });
  }

  // Получить уведомления, которые нужно отправить
  async findPendingNotifications(currentDate: Date): Promise<Notification[]> {
    return await this.notificationRepository.find({
      where: { notifyAt: currentDate, isSent: false },
      relations: ['event'],
    });
  }

  // Обновление статуса отправки
  async markAsSent(notificationId: number): Promise<Notification> {
    const notification = await this.notificationRepository.findOneOrFail({
      where: { id: notificationId },
    });
    notification.isSent = true;
    return await this.notificationRepository.save(notification);
  }

  // Удалить уведомление
  async deleteNotification(notificationId: number): Promise<void> {
    await this.notificationRepository.delete(notificationId);
  }
}