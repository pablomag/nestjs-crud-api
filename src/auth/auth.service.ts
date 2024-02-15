import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as argon from 'argon2';

import { PrismaService } from '../prisma/prisma.service';

import { AuthDto, UserDto } from './dto';
import { handleError } from '../common/error.service';

@Injectable({})
export class AuthService {
  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async login(dto: AuthDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    let passwordMatch = false;
    if (user) {
      passwordMatch = await argon.verify(user.password, dto.password);
    }

    if (!user || !passwordMatch) {
      throw new ForbiddenException('Invalid credentials');
    }

    const token = await this.createToken(user);

    return { message: 'login successful', token };
  }

  async signup(dto: AuthDto) {
    const hashedPassword = await argon.hash(dto.password);

    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          password: hashedPassword,
        },
        select: {
          id: true,
          email: true,
        },
      });

      return { message: 'user successfully created', user };
    } catch (error) {
      return handleError(error);
    }
  }

  createToken(user: UserDto) {
    const { id, email } = user;

    const payload = {
      sub: id,
      email,
    };

    const secret = this.config.get('JWT_SECRET');
    if (!secret) {
      throw new InternalServerErrorException('Authentication secret missing');
    }

    return this.jwt.signAsync(payload, {
      expiresIn: '1h',
      secret,
    });
  }
}
