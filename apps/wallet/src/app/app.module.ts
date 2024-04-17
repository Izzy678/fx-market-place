import { MiddlewareConsumer, Module } from '@nestjs/common';
import { WalletModule } from '../wallet/wallet.module';
import { WalletController } from '../wallet/controller/wallet.controller';
import { WalletService } from '../wallet/wallet.service';
import { AuthGuard, DatabaseModule, DeserializeAuthToken, logCalledRequest } from '@forex-marketplace/libs';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [WalletModule,DatabaseModule],
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
