import { Injectable, PipeTransform, BadRequestException } from "@nestjs/common";
import { ObjectId } from "mongodb";

@Injectable()
export class ValidateObjectId implements PipeTransform<string, ObjectId>{
  
  transform(value: string): ObjectId {
    try {
      const newValue = new ObjectId(value);
      return newValue;
    } catch (error) {
      console.log(error)
      throw new BadRequestException("Invalid Object Id Provided");
    }
  }
}