import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SignInDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}

export class TokenDto {
  userId: string;
  email: string;
  //isVerified: boolean
}

export class RefreshTokenDto {
  @IsString()
  @IsNotEmpty()
  token: string;
}
