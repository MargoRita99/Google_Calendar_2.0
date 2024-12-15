import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from './authentification/auth.module';
import { CalendarModule } from './calendar/calendar.module';
import { EventModule } from './event/event.module';
import { GoogleLogModule } from './google_log/google_log.module';
import { NotificationModule } from './notification/notification.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({ 
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      autoLoadEntities: true,
      synchronize: true, 
    }),
    AuthModule,
    CalendarModule,
    EventModule,
    GoogleLogModule,
    NotificationModule,
    UserModule,
    ScheduleModule.forRoot()
  ],
})
export class AppModule {}