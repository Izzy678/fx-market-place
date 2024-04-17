import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { RefreshTokenDto, SignInDto } from '../dto/auth.dto';
import { IsPublic } from '@forex-marketplace/libs';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  
  @IsPublic()
  @Post('sign-in')
  async signIn(@Body() dto:SignInDto){
   return await this.authService.signIn(dto);
  }

  @Get('generate-auth-token')
  async refreshToken(@Body() dto:RefreshTokenDto){
    return await this.authService.refreshToken(dto.token)
  }
}
