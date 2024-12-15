import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GoogleLogService } from './google_log.service';
import { GoogleLogController } from './google_log.controller';
import { GoogleLog } from './google_log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GoogleLog])],
  controllers: [GoogleLogController],
  providers: [GoogleLogService],
  exports: [GoogleLogService],
})
export class GoogleLogModule {}