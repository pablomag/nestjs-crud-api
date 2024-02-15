import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { UserDto } from '../dto';

export const RequestUser = createParamDecorator(
  (data: (keyof UserDto)[] | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    const { user } = request;

    if (data.length) {
      const filteredUser = {};

      data.forEach(field => (filteredUser[field] = user[field]));

      return data.length === 1 ? filteredUser[data[0]] : filteredUser;
    }

    return user;
  },
);
