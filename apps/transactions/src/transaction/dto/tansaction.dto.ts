import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { CurrencyEnums } from '@forex-marketplace/libs';
import { TransactionTypeEnum } from '../enums/transactionType.enum';
import { ObjectId } from 'mongodb';

export class CreateOrderDto {
  @IsEnum(TransactionTypeEnum)
  type: TransactionTypeEnum;

  @IsEnum(CurrencyEnums)
  @IsNotEmpty()
  currency: CurrencyEnums;

  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  userId?: string;

  createdAt?: Date;
}

export class MyAsset {
  currency:CurrencyEnums
  amount:number
}
export class WalletDto {
  _id: ObjectId;

  userId: string;

  balance: number;

  curreny: CurrencyEnums;

  myAsset: MyAsset[];
}

export class UpdateWalletBalanceDto {
  newBalance: number;
}
export class TransactionOrderDto {
  @IsEnum(TransactionTypeEnum)
  type: TransactionTypeEnum;

  @IsEnum(CurrencyEnums)
  @IsNotEmpty()
  baseCurrency: CurrencyEnums; // Naira is the base currency for buying

  @IsEnum(CurrencyEnums)
  @IsNotEmpty()
  quoteCurrency: CurrencyEnums; // Example: Buying USD with Naira
  
  @IsNotEmpty()
  @IsNumber()
  quantity: number;
}

