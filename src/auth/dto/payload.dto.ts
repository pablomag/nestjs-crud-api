import { IsDate, IsEmail, IsInt, IsNotEmpty } from 'class-validator';

export class PayloadDto {
  @IsInt()
  @IsNotEmpty()
  sub: number;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsDate()
  @IsNotEmpty()
  iat: Date;

  @IsDate()
  @IsNotEmpty()
  exp: Date;
}
