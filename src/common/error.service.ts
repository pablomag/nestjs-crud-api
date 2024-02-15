import {
  BadRequestException,
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

type AppError = PrismaClientKnownRequestError | Error;

export function handleError(error: AppError) {
  const messages = error.message.split('\n');
  const message = messages[messages.length - 1];

  switch (true) {
    case error instanceof PrismaClientKnownRequestError &&
      error.code == 'P2002':
      throw new ForbiddenException(message);
    case error instanceof PrismaClientKnownRequestError &&
      error.code == 'P2025':
      throw new BadRequestException(message);
    default:
      throw new InternalServerErrorException(error.message);
  }
}
