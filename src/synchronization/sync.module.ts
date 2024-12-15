import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SyncService } from './sync.service';
import { GoogleService } from 'src/google/google.service';
import { UserService } from 'src/user/user.service';
import { Event } from 'src/event/event.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Event])],
  providers: [SyncService, GoogleService, UserService],
})
export class SyncModule {}