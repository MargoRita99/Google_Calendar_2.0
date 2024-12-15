import { Controller, Get, Param, Post, Body, UseGuards } from '@nestjs/common';
import { GoogleLogService } from './google_log.service';
import { AuthGuard } from 'src/authentification/auth.guard';
import { CurrentUser } from 'src/authentification/user.decorator';
import { User } from 'src/user/user.entity';

@Controller('google_log')
@UseGuards(AuthGuard)
export class GoogleLogController {
  constructor(private readonly googleLogService: GoogleLogService) {}

  // Создать новый лог
  @Post()
  async createLog(
    @CurrentUser() user: User,
    @Body() body: { action: string; details?: any },
  ) {
    return await this.googleLogService.createLog(user, body.action, body.details);
  }

  // Получить все логи текущего пользователя
  @Get()
  async getLogsForUser(@CurrentUser() user: User) {
    return await this.googleLogService.getLogsForUser(user.id);
  }

  // Получить лог по ID
  @Get(':id')
  async getLogById(@Param('id') id: number) {
    return await this.googleLogService.getLogById(id);
  }
}