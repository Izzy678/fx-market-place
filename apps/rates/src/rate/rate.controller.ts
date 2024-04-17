import {
  RateResponse,
  RateServiceController,
  RateServiceControllerMethods,
  getRateServiceDto,
} from '@forex-marketplace/libs';
import { Observable } from 'rxjs';
import { RateService } from './rate.service';

@RateServiceControllerMethods()
export class RateController implements RateServiceController {
  constructor(private readonly rateService: RateService) {}

  getCurrencyLatestExachangeRate(
    request: getRateServiceDto
  ): RateResponse | Promise<RateResponse> | Observable<RateResponse> {
    return this.rateService.getCurrencyLatestExachangeRate(request);
  }
}
