import { Controller, Post, Body, Get, Param, Patch, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';

@Controller('api')
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @Post('register')
  async register(
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    const user = await this.usersService.createUser(email, password);
    return { message: 'Регистрация успешна', userId: user.id };
  }

  // Получение пользователя по email
  @Get('email/:email')
  async getUserByEmail(@Param('email') email: string): Promise<User> {
    return this.usersService.findUserByEmail(email);
  }

  // Получение пользователя по ID
  @Get(':id')
  async getUserById(@Param('id') id: number): Promise<User> {
    return this.usersService.findUserById(id);
  }

  // Обновление данных пользователя
  @Patch(':id')
  async updateUser(
    @Param('id') id: number,
    @Body() updateData: Partial<User>,
  ): Promise<User> {
    return this.usersService.updateUser(id, updateData);
  }

  // Удаление пользователя
  @Delete(':id')
  async deleteUser(@Param('id') id: number): Promise<void> {
    return this.usersService.deleteUser(id);
  }
}