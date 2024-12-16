import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/user.entity';
import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class AuthService {
  private googleClient: OAuth2Client;

  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {
    this.googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID); // Инициализация клиента Google OAuth
  }

  // Генерация JWT токена
  async generateToken(user: User): Promise<{ accessToken: string }> {
    const payload = { sub: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload); // Подпись токена
    return { accessToken };
  }

  // Проверка данных при авторизации
  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userService.findUserByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }

  // Валидация токена
  async validateToken(token: string): Promise<User> {
    try {
      const decoded = this.jwtService.verify(token);
      const user = await this.userService.findUserById(decoded.sub);
      if (!user) {
        throw new UnauthorizedException('Invalid token');
      }
      return user;
    } catch (err) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  async handleGoogleLogin(tokenId: string): Promise<string> {
    try {
      // Проверка токена через Google API
      const ticket = await this.googleClient.verifyIdToken({
        idToken: tokenId,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
  
      const payload = ticket.getPayload();
      if (!payload) {
        throw new UnauthorizedException('Invalid Google token');
      }
  
      const { email, name } = payload;
  
      // Проверка, есть ли пользователь с таким email
      let user = await this.userService.findUserByEmail(email);
  
      if (!user) {
        // Если пользователя нет, создаем его (пароль не нужен для Google)
        user = await this.userService.createUser(email, null, name);
      }
  
      // Генерация JWT токена для пользователя
      return this.jwtService.sign({ sub: user.id, email: user.email });
    } catch (error) {
      throw new UnauthorizedException('Failed to authenticate with Google');
    }
  }
}