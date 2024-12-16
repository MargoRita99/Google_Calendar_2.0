import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from 'src/user/user.entity';
import { Event } from 'src/event/event.entity';

@Entity()
export class Calendar {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string; // Название календаря

  @Column({ nullable: true })
  description: string; // Описание календаря

  @ManyToOne(() => User, (user) => user.calendars, { onDelete: 'CASCADE' })
  user: User; // Связь с пользователем

  @Column({ nullable: true })
  googleCalendarId: string; // ID календаря в Google

  @OneToMany(() => Event, (event) => event.calendar, { cascade: true })
  events: Event[]; // Связь с событиями в этом календаре

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}