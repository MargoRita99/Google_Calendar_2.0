import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // Регистрация пользователя
  async createUser(email: string, password?: string, name?: string): Promise<User> {
    // Если пароль передан, хэшируем его
    const hashedPassword = password ? await bcrypt.hash(password, 10) : null;
    
    const user = this.userRepository.create({
      email,
      password: hashedPassword,
      name, // Имя пользователя для Google
    });

    return this.userRepository.save(user);
  }

  // Поиск пользователя по email
  async findUserByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  // Поиск пользователя по ID
  async findUserById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  // Обновление данных пользователя
  async updateUser(id: number, updateData: Partial<User>): Promise<User> {
    const user = await this.findUserById(id);
    Object.assign(user, updateData);
    return this.userRepository.save(user);
  }

  // Удаление пользователя
  async deleteUser(id: number): Promise<void> {
    const user = await this.findUserById(id);
    await this.userRepository.remove(user);
  }

  // Получение всех пользователей с токенами Google
  async getUsersWithGoogleTokens(): Promise<User[]> {
    return this.userRepository.find({
      where: {
        tokens: Not('NULL'), // Только пользователи с заполненными токенами
      },
    });
  }

  async saveTokens(userId: number, tokens: { accessToken: string; refreshToken: string; expiryDate: Date }) {
    const user = await this.findUserById(userId);
    user.tokens = tokens;
    await this.userRepository.save(user);
  }
}