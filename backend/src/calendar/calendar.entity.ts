import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from 'src/user/user.entity';
import { Event } from 'src/event/event.entity';

@Entity()
export class Calendar {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string; 

  @Column({ nullable: true })
  description: string; 

  @ManyToOne(() => User, (user) => user.calendars, { onDelete: 'CASCADE' })
  user: User; 

  @Column({ nullable: true })
  googleCalendarId: string; 

  @OneToMany(() => Event, (event) => event.calendar, { cascade: true })
  events: Event[]; 

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}