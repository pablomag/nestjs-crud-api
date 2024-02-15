import { IsDate, IsEmail, IsInt, IsNotEmpty, IsString } from 'class-validator';

export class UserDto {
  @IsInt()
  @IsNotEmpty()
  id: number;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password?: string;

  @IsDate()
  @IsNotEmpty()
  createdAt: Date;

  @IsDate()
  @IsNotEmpty()
  updatedAt: Date;
}
