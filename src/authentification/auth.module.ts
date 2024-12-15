import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from './auth.guard';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET, 
      signOptions: { expiresIn: '60s' }, 
    }),
  ],
  providers: [AuthGuard],
  exports: [JwtModule],
})
export class AuthModule {}