import { IsEmail, IsNotEmpty } from "class-validator";

export class CreateUserDto {
    @IsEmail()
    email: string;
  
    @IsNotEmpty()
    password: string;
    
    @IsNotEmpty()
    userName:string;

    @IsNotEmpty()
    firstName: string;
  
    @IsNotEmpty()
    lastName: string;
  }