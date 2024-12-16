import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GoogleLogService } from './google_log.service';
import { GoogleLogController } from './google_log.controller';
import { GoogleLog } from './google_log.entity';
import { AuthModule } from 'src/authentification/auth.module';
import { AuthGuard } from 'src/authentification/auth.guard';


@Module({
  imports: [TypeOrmModule.forFeature([GoogleLog]), AuthModule],
  controllers: [GoogleLogController],
  providers: [GoogleLogService, AuthGuard],
  exports: [GoogleLogService],
})
export class GoogleLogModule {}