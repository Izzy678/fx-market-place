import {CurrencyEnums} from '@forex-marketplace/libs'
import { Column, Entity, ObjectIdColumn } from 'typeorm';
import { MyAsset } from './asset';
import { ObjectId } from 'mongodb';

@Entity()
export class Wallet {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  userId: string;

  @Column({ type: 'json' })
  myAsset: MyAsset[];
}
