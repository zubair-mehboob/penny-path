import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../../common/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDTO } from '../dtos/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}
  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findOneBy(key: keyof Omit<User, 'password'>, value: any) {
    return await this.userRepository.findOneBy({ [key]: value });
  }

  async create(payload: CreateUserDTO): Promise<User> {
    const existingUser = await this.findOneBy('email', payload.email);
    if (existingUser)
      throw new BadRequestException(
        `User with email: ${payload.email} already exist`,
      );
    const user = this.userRepository.create(payload);
    return await this.userRepository.save(user);
  }

  async update(userId: number, payload: Partial<User>): Promise<User> {
    const existingUser = await this.findOneBy('userId', userId);
    if (!existingUser)
      throw new BadRequestException(`User with id: ${userId} does not exist`);
    Object.assign(existingUser, payload);
    console.log({ existingUser, payload });
    return await this.userRepository.save(existingUser);
  }

  async remove(userId: number): Promise<boolean> {
    const existingUser = await this.findOneBy('userId', userId);
    if (!existingUser)
      throw new BadRequestException(`User with id: ${userId} does not exist`);
    const response = await this.userRepository.delete(existingUser);
    console.log('delete response', response);
    return Boolean(response.affected);
  }
}
