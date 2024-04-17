import {
  Entity,
  Column,
  ObjectIdColumn,
} from 'typeorm';
import { TransactionTypeEnum, TransactionStatus } from '../enums/transactionType.enum';
import { CurrencyEnums } from '@forex-marketplace/libs';


@Entity()
export class Transaction {
  @ObjectIdColumn()
  id?: string;

  @Column()
  userId:string;

  @Column({ type: 'enum', enum: TransactionTypeEnum})
  type:TransactionTypeEnum;
  
  @Column({ type: 'enum', enum: CurrencyEnums})
  basecurrency: CurrencyEnums;

  @Column({ type: 'enum', enum: CurrencyEnums})
  quotecurrency: CurrencyEnums;

  @Column()
  quantity: number;

  @Column({ type: 'timestamp', default: () => new Date() })
  createdAt: Date;
  
  @Column({ type: 'timestamp', default: () => new Date() })
  completedAt: Date;

  @Column({type:'enum',enum:TransactionStatus})
  transactionStatus:TransactionStatus;

  @Column()
  transactionDetails:string
}

