import { Injectable } from '@nestjs/common';
import { CurrencyEnums } from '@forex-marketplace/libs';
import axios from 'axios';
import { getRateServiceDto, RateResponse } from '../../../../libs/src/lib/types/rate';
import { Observable } from 'rxjs';
import * as process from 'process'

@Injectable()
export class RateService {
  getCurrencyLatestExachangeRate(
    request: getRateServiceDto
  ): RateResponse | Promise<RateResponse> | Observable<RateResponse> {

    const exchangeRateBaseUrl = process.env.EXCHANGE_RATE_BASE_URL;
    const CurrencyEnumsArray = Object.values(CurrencyEnums);
    const newBaseCurrency = CurrencyEnumsArray[request.baseCurrency];
    const newQuoteCurrency = CurrencyEnumsArray[request.quoteCurrency];

    return new Promise<RateResponse>((resolve, reject) => {
      axios
        .get(
          `${exchangeRateBaseUrl}/${newQuoteCurrency}`
        )
        .then((response) => {
          const rate = response.data.conversion_rates[newBaseCurrency];
          const rateResponse: RateResponse = {
            rate: rate,
          };
          resolve(rateResponse);
        })
        .catch((error) => {
          reject(error.message);
        });
    });
  }
}
