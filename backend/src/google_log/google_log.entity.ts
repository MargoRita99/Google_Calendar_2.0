import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from 'src/user/user.entity';

@Entity('google_log')
export class GoogleLog {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.syncLogs, { onDelete: 'CASCADE' })
  user: User; 

  @Column()
  action: string; 

  @Column('json', { nullable: true })
  details: any; 

  @CreateDateColumn()
  createdAt: Date; 
}