import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GoogleLog } from './google_log.entity';
import { User } from 'src/user/user.entity';

@Injectable()
export class GoogleLogService {
  constructor(
    @InjectRepository(GoogleLog)
    private readonly googleLogRepository: Repository<GoogleLog>,
  ) {}

  async createLog(user: User, action: string, details?: any): Promise<GoogleLog> {
    const log = this.googleLogRepository.create({
      user,
      action,
      details,
    });
    return await this.googleLogRepository.save(log);
  }

  async getLogsForUser(userId: number): Promise<GoogleLog[]> {
    return await this.googleLogRepository.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
    });
  }

  async getLogById(logId: number): Promise<GoogleLog> {
    return await this.googleLogRepository.findOneOrFail({
      where: { id: logId },
    });
  }
}