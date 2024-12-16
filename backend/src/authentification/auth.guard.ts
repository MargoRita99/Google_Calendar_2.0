import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    if (!authHeader) {
      return false;
    }

    const token = authHeader.split(' ')[1];
    try {
      const payload = this.jwtService.verify(token); // Проверяем JWT токен
      request.user = payload; // Добавляем данные пользователя в запрос
      return true;
    } catch (error) {
      return false;
    }
  }
}