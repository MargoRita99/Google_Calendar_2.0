import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      secret: 'your_jwt_secret', // !!!Секрет для подписи токенов
      signOptions: { expiresIn: '1h' }, // !!! Время жизни токена
    }),
  ],
  providers: [],
  exports: [JwtModule],
})
export class AuthModule {}