/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';
import { NestMicroserviceOptions } from '@nestjs/common/interfaces/microservices/nest-microservice-options.interface';
import {MicroserviceOptions, Transport} from '@nestjs/microservices';
import { RateModule } from './rate/rate.module';
import { join } from 'path';
import {protobufPackage, RATE_PACKAGE_NAME} from '../../../libs/src/lib/types/rate'


async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(RateModule,{
    transport:Transport.GRPC,
    options:{
      protoPath:join(__dirname,'../../../proto/rate.proto'),
      package:RATE_PACKAGE_NAME
    }
  });
  await app.listen();
}
bootstrap();