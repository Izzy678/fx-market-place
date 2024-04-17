import { Module } from '@nestjs/common';
import { RateModule } from '../rate/rate.module';
import { RateController } from '../rate/rate.controller';
import { RateService } from '../rate/rate.service';

@Module({
  imports: [RateModule],
  controllers: [RateController],
  providers: [RateService],
})
export class AppModule {}
