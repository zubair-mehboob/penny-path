import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDTO } from '../dtos/create-user.dto';
import * as bcrypt from 'bcrypt';
import { User } from '../user.entity';
import { SigninDTO } from '../dtos/sign-in.dto';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}
  async signin(payload: SigninDTO) {
    const existingUser = await this.userService.findOneBy(
      'email',
      payload.email,
    );
    if (!existingUser) throw new NotFoundException('user does not exist');
    const isCorrectPassword = await this.comparePassword(
      payload.password,
      existingUser.password,
    );

    if (!isCorrectPassword)
      throw new BadRequestException('Invalid credentials');
    return existingUser;
  }

  async signup(payload: CreateUserDTO): Promise<User> {
    const existingUser = await this.userService.findOneBy(
      'email',
      payload.email,
    );
    if (existingUser) throw new BadRequestException('user already exist');
    const hash = await this.hashPassword(payload.password);
    payload.password = hash;
    const user = await this.userService.create(payload);
    return user;
  }
  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10; // how strong the hash should be
    return await bcrypt.hash(password, saltRounds);
  }

  private async comparePassword(
    password: string,
    hash: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }
}
