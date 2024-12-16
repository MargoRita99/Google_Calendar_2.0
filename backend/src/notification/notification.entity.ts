import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { Event } from 'src/event/event.entity';

@Entity()
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Event, (event) => event.notifications, { onDelete: 'CASCADE' })
  event: Event; 

  @Column()
  notifyAt: Date; 

  @Column({ default: false })
  isSent: boolean; 

  @CreateDateColumn()
  createdAt: Date;
}