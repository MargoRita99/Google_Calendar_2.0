import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { Event } from 'src/event/event.entity';

@Entity()
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Event, (event) => event.notifications, { onDelete: 'CASCADE' })
  event: Event; // Связь с событием

  @Column()
  notifyAt: Date; // Время, когда нужно отправить уведомление

  @Column({ default: false })
  isSent: boolean; // Отправлено ли уведомление

  @CreateDateColumn()
  createdAt: Date;
}