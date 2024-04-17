/* eslint-disable */
import { CurrencyEnums } from "@forex-marketplace/libs";
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "Rate";



export interface getRateServiceDto {
  baseCurrency: CurrencyEnums;
  quoteCurrency: CurrencyEnums;
}

export interface RateResponse {
  rate: number;
}

export const RATE_PACKAGE_NAME = "Rate";

export interface RateServiceClient {
  getCurrencyLatestExachangeRate(request: getRateServiceDto): Observable<RateResponse>;
}

export interface RateServiceController {
  getCurrencyLatestExachangeRate(
    request: getRateServiceDto,
  ): Promise<RateResponse> | Observable<RateResponse> | RateResponse;
}

export function RateServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["getCurrencyLatestExachangeRate"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("RateService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("RateService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const RATE_SERVICE_NAME = "RateService";
