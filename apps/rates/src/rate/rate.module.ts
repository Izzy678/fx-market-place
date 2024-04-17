import { Module } from "@nestjs/common";
import { Client, ClientsModule, Transport } from "@nestjs/microservices";
import { join } from "path";
import { RATE_SERVICE_NAME , RATE_PACKAGE_NAME} from "@forex-marketplace/libs";
import { RateController } from "./rate.controller";
import { RateService } from "./rate.service";


@Module({
    imports:[ClientsModule.register([
        {
            name : RATE_SERVICE_NAME,
            transport:Transport.GRPC,
            options:{
               // url: 'localhost:5001',
                package:RATE_PACKAGE_NAME,
                protoPath:join(__dirname,'../../../proto/rate.proto'),
            }   
        }
    ])],
    controllers:[RateController] ,
    providers:[RateService]
})
export class RateModule {}