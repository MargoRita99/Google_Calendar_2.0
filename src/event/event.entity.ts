import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from 'src/user/user.entity';
import { Calendar } from 'src/calendar/calendar.entity';
import { Notification } from 'src/notification/notification.entity';

@Entity()
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @Column({ default: false })
  isRecurring: boolean;

  @Column('json', { nullable: true })
  recurrenceRules: { frequency: string; interval: number; byDay?: string[] }; // Правила повторения (если событие повторяющееся)

  @ManyToOne(() => User, (user) => user.events, { onDelete: 'CASCADE' })
  user: User; // Связь с пользователем

  @ManyToOne(() => Calendar, (calendar) => calendar.events, { onDelete: 'CASCADE' })
  calendar: Calendar; // Связь с календарем

  @OneToMany(() => Notification, (notification) => notification.event, { cascade: true })
  notifications: Notification[]; // Связь с уведомлениями для события

  @Column({ nullable: true })
  googleEventId: string; // ID события в Google Calendar

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}