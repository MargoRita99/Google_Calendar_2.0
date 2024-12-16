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
    this.googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  }

  async generateToken(user: User): Promise<{ accessToken: string }> {
    const payload = { sub: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload);
    return { accessToken };
  }

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
      const ticket = await this.googleClient.verifyIdToken({
        idToken: tokenId,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
  
      const payload = ticket.getPayload();
      if (!payload) {
        throw new UnauthorizedException('Invalid Google token');
      }
  
      const { email, name } = payload;
  
      let user = await this.userService.findUserByEmail(email);
  
      if (!user) {
        user = await this.userService.createUser(email, null, name);
      }
  
      return this.jwtService.sign({ sub: user.id, email: user.email });
    } catch (error) {
      throw new UnauthorizedException('Failed to authenticate with Google');
    }
  }
}