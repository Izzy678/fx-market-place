import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UsersService } from '../service/users.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import {
  IsPublic,
  TokenData,
  TokenDto,
  ValidateObjectId,
} from '@forex-marketplace/libs';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @IsPublic()
  @Post('create-user')
  async create(@Body() dto: CreateUserDto) {
    const createdUser = await this.usersService.create(dto);
    return {
      user: createdUser,
      message: 'User created successfully',
    };
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':userId')
  findOne(@Param('userId', new ValidateObjectId()) id: string) {
    return this.usersService.findOne(id);
  }

  @Patch('update-user')
  update(
    @Body() updateUserDto: UpdateUserDto,
    @TokenData() tokenDto: TokenDto
  ) {
    return this.usersService.update(tokenDto.userId, updateUserDto);
  }

  @Delete('delete-user/:id')
  remove(@Param('id', new ValidateObjectId()) id: string) {
    return this.usersService.deleteUser(id);
  }

  @Get('view-user-profile')
  async viewUserProfile(@TokenData() tokendata: TokenDto) {
    console.log('toeknData,', tokendata);
    return await this.usersService.viewUserProfile(tokendata.userId);
  }
}
