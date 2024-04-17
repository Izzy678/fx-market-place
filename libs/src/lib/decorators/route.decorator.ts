import { SetMetadata } from "@nestjs/common"

export const IsPublic=()=>{
    return SetMetadata('isPublic',true);
}