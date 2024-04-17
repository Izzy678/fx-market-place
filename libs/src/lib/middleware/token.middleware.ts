import {
  BadRequestException,
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import * as process from 'process'

@Injectable()
export class DeserializeAuthToken implements NestMiddleware {
  constructor(
  ) {}

  private readonly accessTokenSecret = process.env['ACCESS_TOKEN_SECRET'] as string;
 

  async use(req: Request, res: Response, next: NextFunction) {
    const authorizationToken = this.extractTokenFromHeader(req);
    if (!authorizationToken) return next();
    try {
      const payLoad = jwt.verify(authorizationToken, this.accessTokenSecret);
      res.locals['user'] = payLoad;
      return next();
    } catch (error) {
      if (error.name === 'TokenExpiredError')
        throw new UnauthorizedException('Jwt Expired');
      throw new BadRequestException('Invalid Token');
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    if (!request.headers.authorization) return;
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    if (type !== 'Bearer') {
      throw new BadRequestException('Please provide a Bearer token ');
    }
    if (!token) return;
    return token;
    // return type === 'Bearer' ? token : undefined;
  }
}
