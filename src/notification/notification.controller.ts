import { Controller, Post, Get, Param, Body, Delete, Patch } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { Notification } from './notification.entity';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  // Создать уведомление
  @Post()
  async create(@Body() createNotificationDto: { eventId: number; notifyAt: Date }): Promise<Notification> {
    const { eventId, notifyAt } = createNotificationDto;
    const event = { id: eventId } as any; // Предполагаемая связь, в реальности получить из EventService
    return await this.notificationService.createNotification(event, new Date(notifyAt));
  }

  // Получить уведомления для конкретного события
  @Get('event/:eventId')
  async getByEvent(@Param('eventId') eventId: number): Promise<Notification[]> {
    return await this.notificationService.findByEvent(eventId);
  }

  // Пометить уведомление как отправленное
  @Patch(':id/send')
  async markAsSent(@Param('id') id: number): Promise<Notification> {
    return await this.notificationService.markAsSent(id);
  }

  // Удалить уведомление
  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    return await this.notificationService.deleteNotification(id);
  }
}