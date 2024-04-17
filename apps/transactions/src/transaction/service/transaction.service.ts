import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionOrderDto, WalletDto } from '../dto/tansaction.dto';
import axios from 'axios';
import { TokenDto } from '@forex-marketplace/libs';
import { TransactionTypeEnum, TransactionStatus } from '../enums/transactionType.enum';
import { BadRequestException, Inject, OnModuleInit } from '@nestjs/common';
import { Transaction } from '../entities/transaction.entity';
import { RateServiceClient, RATE_SERVICE_NAME, CurrencyEnums } from '@forex-marketplace/libs';
import { ClientGrpc } from '@nestjs/microservices';

export class TransactionService implements OnModuleInit{
  private rateService:RateServiceClient

  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    private readonly configService: ConfigService,
    @Inject(RATE_SERVICE_NAME) private client:ClientGrpc
  ) {}

  onModuleInit() {
    this.rateService=this.client.getService<RateServiceClient>(RATE_SERVICE_NAME);
  }

  private readonly walletServiceBaseUrl =
    this.configService.getOrThrow('WALLET_SERVICE_URL');

  async createOrder(dto: TransactionOrderDto, tokenData: TokenDto) {
    try {
      const transaction = this.transactionRepository.create({
        ...dto,
        transactionStatus: TransactionStatus.Pending,
        basecurrency: dto.baseCurrency,
        quotecurrency: dto.quoteCurrency,
        createdAt: new Date(),
        userId: tokenData.userId,
      });
  
      const response = await axios.get(
        `${this.walletServiceBaseUrl}/get-user-wallet/${tokenData.userId}`
      );
      const wallet = response.data as WalletDto;
  
      if (dto.type === TransactionTypeEnum.Buy)
        return await this.handleBuyTransaction(wallet, dto, transaction);
       // if sell order
      return await this.handleSellTransaction(wallet, dto, transaction);
    } catch (error) {
      throw new BadRequestException(`error completing order:${error.message}`)
    }
  }

  private async updateUserWallet(wallet: WalletDto) {
    await axios.patch(`${this.walletServiceBaseUrl}/update-wallet`, {
      ...wallet,
    });
  }
  private async handleBuyTransaction(
    wallet: WalletDto,
    dto: TransactionOrderDto,
    transaction: Transaction
  ) {
    const data = await this.rateService.getCurrencyLatestExachangeRate({
      baseCurrency: dto.baseCurrency ,
      quoteCurrency: dto.quoteCurrency
    }).toPromise()
    
    const amountTobePaid = dto.quantity * data.rate;
    const baseCurrencyAsset = wallet.myAsset.find(
      (asset) => dto.baseCurrency === asset.currency
    );
    if (!baseCurrencyAsset || baseCurrencyAsset.amount < amountTobePaid) {
      await this.handleInsufficientBalanceTransaction(transaction, dto);
    }

    //check if the quote currency to be bought exist
    const quoteCurrencyAsset = wallet.myAsset.find(
      (asset) => dto.quoteCurrency === asset.currency
    );
    if (!quoteCurrencyAsset) {
      wallet.myAsset.push({
        amount: dto.quantity,
        currency: dto.quoteCurrency
      });
       //update base currency balance
      baseCurrencyAsset.amount -= amountTobePaid;
    } else {
      //else update the quote currency
      baseCurrencyAsset.amount -= amountTobePaid;
      quoteCurrencyAsset.amount += dto.quantity;
    }

    //update wallet
    await this.updateUserWallet(wallet);
    //update tansaction status
    const transactionData = await this.handleSuccessfullTransaction(
      transaction,
      dto,
      amountTobePaid
    );
    return {
      message: 'order completed successfully',
      data: transactionData,
    };
  }

  private async handleSellTransaction(
    wallet: WalletDto,
    dto: TransactionOrderDto,
    transaction: Transaction
  ) {
    const data = await this.rateService.getCurrencyLatestExachangeRate({
      baseCurrency: dto.baseCurrency ,
      quoteCurrency: dto.quoteCurrency
    }).toPromise()
    const amountToReceive = dto.quantity * data.rate;
    // Check if the user has enough of the quote currency to sell
    const quoteCurrencyAsset = wallet.myAsset.find(
      (asset) => dto.quoteCurrency === asset.currency
    );
    if (!quoteCurrencyAsset || quoteCurrencyAsset.amount < dto.quantity) {
      await this.handleInsufficientBalanceTransaction(transaction, dto);
    }
    // Calculate the amount to receive and update the user's wallet
    quoteCurrencyAsset.amount -= dto.quantity; // Reduce the amount of quote currency
    const baseCurrencyAsset = wallet.myAsset.find(
      (asset) => dto.baseCurrency === asset.currency
    );
    if (!baseCurrencyAsset) {
      wallet.myAsset.push({
        currency:dto.baseCurrency,
        amount:amountToReceive
      }); // Add the base currency asset
    } else {
      baseCurrencyAsset.amount += amountToReceive; // Add the received amount to the existing base currency balance
    }

    // Update the user's wallet
    await this.updateUserWallet(wallet);
    //update tansaction status
    const transactionData = await this.handleSuccessfullTransaction(
      transaction,
      dto,
      0,
      amountToReceive
    );

    return {
      message: 'Sell order completed successfully',
      data: transactionData,
    };
  }

  private async handleInsufficientBalanceTransaction(
    transaction: Transaction,
    dto: TransactionOrderDto
  ) {
    (transaction.transactionStatus = TransactionStatus.Failed),
      (transaction.completedAt = new Date());
      transaction.transactionDetails = `failed to complete transaction due to insufficient balance`
    this.transactionRepository.save(transaction);
    throw new BadRequestException(`Insufficient ${dto.baseCurrency} balance`);
  }

  private async handleSuccessfullTransaction(
    transaction: Transaction,
    dto: TransactionOrderDto,
    amountTobePaid?: number,
    amountToReceive?: number
  ) {
    (transaction.transactionStatus = TransactionStatus.Success),
      (transaction.completedAt = new Date());
    transaction.transactionDetails =
      dto.type === TransactionTypeEnum.Buy
        ? `You bought ${dto.quantity} ${dto.quoteCurrency} for ${amountTobePaid} ${dto.baseCurrency}`
        : `You sold ${dto.quantity} ${dto.quoteCurrency} for ${amountToReceive} ${dto.baseCurrency}`;
    return await this.transactionRepository.save(transaction);
  }

  
  async getUserTransactions(dto: TokenDto) {
    const transactions = await this.transactionRepository.find({
      where: { userId: dto.userId },
    });
    return {
      message: 'transaction retrieved successfully',
      data: transactions,
    };
  }
}
