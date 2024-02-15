import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';

import { JwtGuard } from '../auth/guard';
import { RequestUser } from '../auth/decorator';
import { UserDto } from '../auth/dto';
import { UserEditDto } from './dto';
import { UserService } from './user.service';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  getMe(@RequestUser(['id', 'email', 'firstName', 'lastName']) user: UserDto) {
    return user;
  }

  @Patch('me')
  editUser(
    @RequestUser(['id']) userId: number,
    @Body() userEditDto: UserEditDto,
  ) {
    return this.userService.editUser(userId, userEditDto);
  }
}
