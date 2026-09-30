import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { UsersService } from 'src/users/users.service';
import { EmailService } from './email.service';
import type { RegisterDto } from './dto/register.dto';
import type { LoginDto } from './dto/login.dto';
import type { Response } from 'express';
import type { User } from '../db/schema';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private emailService: EmailService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    // check whether the email already existed yet ?
    const existingUser = await this.usersService.findByEmail(dto.email);
    if (existingUser) {
      throw new ConflictException(
        'An account with this email already existed!!',
      );
    }

    // hash the raw password
    const passwordHash = await bcrypt.hash(dto.password, 12);
    // create a verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpiresAt = new Date(
      Date.now() + 24 * 60 * 60 * 1000, // 24h from Now
    );

    const user = await this.usersService.create({
      name: dto.name,
      email: dto.email,
      passwordHash,
      verificationToken,
      verificationTokenExpiresAt,
    });
    void this.emailService.sendVerificationEmail(user.email, verificationToken);
    return {
      message:
        'Registration Successfully. Please Check your email to verify your account !',
      data: user,
    };
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password !');
    }

    const passswordMatch = await bcrypt.compare(
      dto.password,
      user.passwordHash,
    );

    if (!passswordMatch) {
      throw new UnauthorizedException('Invalid Email or password !');
    }

    if (!user.isVerified) {
      throw new UnauthorizedException(
        'Please verify your email before logging in !',
      );
    }

    const tokens = await this.generateTokens(user);
    await this.saveRefreshToken(user.id, refreshToken);
    this.setRefreshTokenCookie(resizeBy, tokens.refreshToken);
    return {
      accessToken: tokens.accessToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }
  private async generateToken(user: User) {
    const payload = { sub: user.id, email: user.email, role: user.role };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
      expiresIn: this.configService.get<number>('JWT_EXPIRES_IN'),
    });

    const refreshToken = await this.jwtService
  }
}
