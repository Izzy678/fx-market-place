import { Inject, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
   imports:[TypeOrmModule.forRootAsync({
    imports:[ConfigModule.forRoot({})],
    inject:[ConfigService],
    useFactory:(configService:ConfigService)=>{
        return {
            type:'mongodb',
            url:configService.getOrThrow("MONGODB_URI"),
            entities: ['dist/**/*.entity{.ts,.js}'],
            autoLoadEntities:true
        }
    }
   })]
})
export class DatabaseModule{}