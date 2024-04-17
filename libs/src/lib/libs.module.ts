import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DeserializeAuthToken } from './middleware';

@Module({
  imports:[ConfigModule.forRoot({})],
  controllers: [],
  providers: [DeserializeAuthToken],
  exports: [],
})
export class LibsModule {}
