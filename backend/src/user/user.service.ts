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


  async createUser(email: string, password?: string, name?: string): Promise<User> {

    const hashedPassword = password ? await bcrypt.hash(password, 10) : null;
    
    const user = this.userRepository.create({
      email,
      password: hashedPassword,
      name, 
    });

    return this.userRepository.save(user);
  }

  
  async findUserByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

 
  async findUserById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }


  async updateUser(id: number, updateData: Partial<User>): Promise<User> {
    const user = await this.findUserById(id);
    Object.assign(user, updateData);
    return this.userRepository.save(user);
  }

  async deleteUser(id: number): Promise<void> {
    const user = await this.findUserById(id);
    await this.userRepository.remove(user);
  }


  async getUsersWithGoogleTokens(): Promise<User[]> {
    return this.userRepository.find({
      where: {
        tokens: Not('NULL'), 
      },
    });
  }

  async saveTokens(userId: number, tokens: { accessToken: string; refreshToken: string; expiryDate: Date }) {
    const user = await this.findUserById(userId);
    user.tokens = tokens;
    await this.userRepository.save(user);
  }
}