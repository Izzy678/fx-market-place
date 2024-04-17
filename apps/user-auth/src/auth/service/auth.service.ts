import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { SignInDto, TokenDto } from '../dto/auth.dto';
import { UsersService } from '../../users/service/users.service';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { User } from '../../users/entities/user.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  
  constructor(
    private readonly userService: UsersService,
    private readonly configService: ConfigService
  ) {}

  private readonly accessTokenSecret = this.configService.getOrThrow('ACCESS_TOKEN_SECRET');
  private readonly refreshTokenSecret = this.configService.getOrThrow('REFRESH_TOKEN_SECRET');
  private readonly accessTokenTtl = this.configService.getOrThrow('ACCESS_TOKEN_TTL');
  private readonly refreshTokenTtl =  this.configService.getOrThrow('REFRESH_TOKEN_TTL');

  async signIn({ email, password }: SignInDto) {
    const user = await this.userService.findUserByEmail(email);
    if (!user) throw new NotFoundException('Invalid email or password');

    if (!(await this.comparePassword(password, user.password)))
      throw new UnauthorizedException('Invalid email or password');
    return {
      message: 'logged in successfully',
      user: {
        ...user,
      },
      tokens: this.generateTokens(user),
    };
  }

  async refreshToken(token: string) {
    try {
      const tokenData: TokenDto = jwt.verify(
        token,
        'my-secret-key'
      ) as unknown as TokenDto;
      const user = await this.userService.findUserByEmail(tokenData.email);
      if (!user) throw new NotFoundException('Invalid email or password');
      return this.generateTokens(user);
    } catch (error) {
      throw new BadRequestException(
        'Invalid Refresh Token Or Refresh Token expired.Login to continue'
      );
    }
  }

  async comparePassword(
    myPlaintextPassword: string,
    hash: string
  ): Promise<boolean> {
    console.log(await bcrypt.compare(myPlaintextPassword, hash));
    return await bcrypt.compare(myPlaintextPassword, hash);
  }

  generateTokens(user: User) {
    const tokenData: TokenDto = {
      userId: user._id as unknown as string,
      email: user.email,
    };
    return {
      accessToken: jwt.sign(tokenData, this.accessTokenSecret, { expiresIn:this.accessTokenTtl }),
      refreshToken: jwt.sign({ email: user.email },this.refreshTokenSecret, {
        expiresIn: this.refreshTokenTtl,
      }),
    };
  }
}
