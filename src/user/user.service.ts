import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { UserEditDto } from './dto/user-edit.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async editUser(id: number, userEditDto: UserEditDto) {
    const user = await this.prisma.user.update({
      where: {
        id,
      },
      data: {
        ...userEditDto,
      },
    });

    delete user.password;

    return user;
  }
}
