import { Body, Controller, Get, Post } from '@nestjs/common';
import { TransactionOrderDto } from '../dto/tansaction.dto';
import { TokenData, TokenDto } from '@forex-marketplace/libs';
import { TransactionService } from '../service/transaction.service';

@Controller('transaction')
export class TransactionController {
  transaction2Service: any;
  constructor(private readonly transactionServcie: TransactionService) {}

  @Post('submit-order')
  async submitOrder(
    @TokenData() tokenData: TokenDto,
    @Body() dto: TransactionOrderDto
  ) {
    return await this.transactionServcie.createOrder(dto, tokenData);
  }

  @Get('my-transactions')
  async getUserTransactions(@TokenData() tokendata: TokenDto) {
    return await this.transactionServcie.getUserTransactions(tokendata);
  }
}
