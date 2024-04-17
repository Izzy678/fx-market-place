import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
} from '@nestjs/common';
import { WalletService } from '../wallet.service';
import {
  IsPublic,
  TokenData,
  TokenDto,
} from '@forex-marketplace/libs';

import { FundWalletDto } from '../dto/fundWallet.dto';
import { Wallet } from '../entities/wallet.entity';

@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Post('create')
  create(@TokenData() tokenData: TokenDto) {
    return this.walletService.createUserWallet(tokenData);
  }

  @Patch('fund-wallet')
  async fundWallet(
    @TokenData() tokenData: TokenDto,
    @Body() dto: FundWalletDto
  ) {
    return await this.walletService.fundWallet(tokenData, dto);
  }

  @IsPublic()
  @Get('get-user-wallet/:userId')
  async findUserWallet(@Param('userId') userId: string) {
    return await this.walletService.findUserWallet(userId);
  }

  @IsPublic()
  @Patch('update-wallet')
  async updateWallet(@Body() wallet: Wallet) {
    return await this.walletService.updateWalletBalance(wallet);
  }

  @Get('wallet-balance')
  async getWalletBalance(@TokenData() dto:TokenDto){
    return await this.getWalletBalance(dto);
  }
}
