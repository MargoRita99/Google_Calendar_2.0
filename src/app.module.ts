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
      host: 'localhost',
      port: 5432,
      username: 'your_username',
      password: 'your_password',
      database: 'your_database',
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