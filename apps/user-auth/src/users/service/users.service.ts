import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { ObjectId } from 'mongodb';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async create(dto: CreateUserDto): Promise<User> {
    //check if user exist
    const userExist = await this.userRepository.findOne({
      where: { email: dto.email },
    });
    if (userExist)
      throw new BadRequestException('user with the provided email exist');
    const user = this.userRepository.create({
      ...dto,
      createdAt: new Date(),
    });
    return await this.userRepository.save(user);
  }

  async findAll() {
    return await this.userRepository.find();
  }

  async findOne(id: string) {
    const user = await this.userRepository.findOne({
      where: { _id: new ObjectId(id) },
    });
    if (!user)
      throw new NotFoundException('user with the provided Id not found');
    return {
      message: 'user retrieved successfully',
      user: user,
    };
  }

  async findUserByEmail(email: string) {
    return await this.userRepository.findOne({ where: { email } });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const result = await this.userRepository.update(id, {
      ...updateUserDto,
      updatedAt: new Date(),
    });
    if (result.raw.modifiedCount === 0)
      throw new NotFoundException('user with the provided Id not found');
    return {
      message: 'user info updated successfully',
    };
  }

  async deleteUser(id: string) {
    const result = await this.userRepository.delete(id);
    if (result.raw.deletedCount === 0)
      throw new NotFoundException('user with the provided Id not found');
    return {
      message: 'user deleted successfully',
    };
  }

  async viewUserProfile(id: string) {
    const user = await this.userRepository.findOne({
      where: { _id: new ObjectId(id) },
    });
    if (!user)
      throw new NotFoundException('user with the provided Id not found');
    return {
      message: 'user profile retrieved',
      data: user,
    };
  }
}
