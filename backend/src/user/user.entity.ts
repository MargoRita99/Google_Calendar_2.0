import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Event } from 'src/event/event.entity';
import { Calendar } from 'src/calendar/calendar.entity';
import { GoogleLog } from 'src/google_log/google_log.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  googleCalendarId: string; 

  @Column('json', { nullable: true })
  tokens: { accessToken: string; refreshToken: string; expiryDate: Date };

  @OneToMany(() => Event, (event) => event.user, { cascade: true })
  events: Event[]; 

  @OneToMany(() => Calendar, (calendar) => calendar.user, { cascade: true })
  calendars: Calendar[]; 

  @OneToMany(() => GoogleLog, (googleLog) => googleLog.user, { cascade: true })
  syncLogs: GoogleLog[]; 
  
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}