import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TokenDto } from '@forex-marketplace/libs';
import { InjectRepository } from '@nestjs/typeorm';
import { Wallet } from './entities/wallet.entity';
import { Repository } from 'typeorm';
import { FundWalletDto } from './dto/fundWallet.dto';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Wallet)
    private readonly walletRepository: Repository<Wallet>
  ) {}

  async createUserWallet(dto: TokenDto) {
    const userWalletExist = await this.walletRepository.findOne({
      where: { userId: dto.userId },
    });
    if (userWalletExist)
      throw new BadRequestException('user has an existing wallet');
    const wallet = this.walletRepository.create({
      userId: dto.userId,
      myAsset: [],
    });
    return {
      message: 'wallet created successfully',
      data: await this.walletRepository.save(wallet),
    };
  }

  async fundWallet(tokenDto: TokenDto, dto: FundWalletDto) {
    const wallet = await this.walletRepository.findOne({
      where: { userId: tokenDto.userId },
    });
    if (!wallet)
      throw new NotFoundException(
        'error creating user wallet,user wallet not found or user does not exist'
      );
    const foundAsset = wallet.myAsset.find(
      (asset) => dto.currency === asset.currency
    );
    if (!foundAsset) {
      wallet.myAsset.push({
        currency: dto.currency,
        amount: dto.amount
      });
    } else {
      foundAsset.amount += dto.amount;
    }
    return {
      message: 'wallet funded successfully',
      data: await this.walletRepository.save(wallet),
    };
  }

  async findUserWallet(userId: string) {
    const wallet = await this.walletRepository.findOne({
      where: { userId: userId },
    });
    if (!wallet) throw new BadRequestException('user does not have a wallet');
    return wallet;
  }

  async updateWalletBalance(wallet: Wallet) {
    await this.walletRepository.update(
      { userId: wallet.userId },
      { myAsset: wallet.myAsset }
    );
  }
  
  async getWalletBalance(tokenData:TokenDto){
    const wallet = await this.walletRepository.findOne({
      where: { userId: tokenData.userId },
    });
     return {
      message:"wallet balance retrieved successfully",
      balances:wallet.myAsset
     }
  }
}
