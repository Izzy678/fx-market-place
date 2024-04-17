import { MiddlewareConsumer, Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard, DatabaseModule, DeserializeAuthToken, logCalledRequest } from '@forex-marketplace/libs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    DatabaseModule
    // TypeOrmModule.forRoot({
    //   type: 'mongodb',
    //   url: 'mongodb+srv://izzy678:Oyp3cS5cYVs07GGD@cluster0.4ysg0je.mongodb.net/forex-market-place',
    //   entities: [__dirname + '/../../src/entity/*.js'],
    //   // entities: [User],
    //   autoLoadEntities: true,
    // }),
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
