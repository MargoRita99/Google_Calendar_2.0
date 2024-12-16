import * as dotenv from 'dotenv';
dotenv.config();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:3001', // Разрешаем доступ с фронтенда на порту 3001
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type, Authorization', // Разрешаем определенные заголовки
  });
  await app.listen(3000);
}
bootstrap();