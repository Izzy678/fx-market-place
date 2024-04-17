import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TransationModule } from '../transaction/transaction.module';
import {
  AuthGuard,
  DatabaseModule,
  DeserializeAuthToken,
  logCalledRequest,
} from '@forex-marketplace/libs';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    TransationModule,
     DatabaseModule,
    ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(DeserializeAuthToken).forRoutes('*');

    consumer.apply(logCalledRequest).forRoutes('*');
  }
}
