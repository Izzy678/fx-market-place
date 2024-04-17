import { CurrencyEnums } from "@forex-marketplace/libs";
import { IsEnum, IsNotEmpty, IsNumber } from "class-validator";

export class FundWalletDto {
@IsNotEmpty()
@IsNumber()
amount:number;

@IsNotEmpty()
@IsEnum(CurrencyEnums)
currency:CurrencyEnums;

}
