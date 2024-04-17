import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionController } from './controller/transaction.controller';
import { TransactionService } from './service/transaction.service';
import { Transaction } from './entities/transaction.entity';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import {RATE_PACKAGE_NAME,RATE_SERVICE_NAME} from '@forex-marketplace/libs'
import { join } from 'path';
@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction]),
    ConfigModule.forRoot({}),
    ClientsModule.register([
      {
        name : RATE_SERVICE_NAME,
        transport:Transport.GRPC,
        options:{
          //url: 'localhost:5001',
            package:RATE_PACKAGE_NAME,
            protoPath:join(__dirname,'../../../proto/rate.proto'),
        }
    }
     ]),
  ],
  controllers: [TransactionController],
  providers: [TransactionService],
})
export class TransationModule {}
