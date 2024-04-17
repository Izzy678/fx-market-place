import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { TokenDto } from '../dto';



export const TokenData = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const response = ctx.switchToHttp().getResponse();
    const user =  response.locals.user as TokenDto;
    const tokenData:TokenDto = {
      ...user
    }
    return tokenData;
  }
);