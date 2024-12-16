import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from 'src/user/user.entity';

@Entity('google_log')
export class GoogleLog {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.syncLogs, { onDelete: 'CASCADE' })
  user: User; // Пользователь, для которого происходила синхронизация

  @Column()
  action: string; // Тип действия (например, "fetch", "update", "delete")

  @Column('json', { nullable: true })
  details: any; // Детали синхронизации (например, ID событий)

  @CreateDateColumn()
  createdAt: Date; // Время выполнения синхронизации
}