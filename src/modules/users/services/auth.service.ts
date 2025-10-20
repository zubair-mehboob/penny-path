import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from './user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AccountService } from 'src/modules/accounts/services/account.service';
import { CreateUserDTO } from 'src/common/dtos/request/user.dto';
import { SigninDTO } from 'src/common/dtos/request/auth.dto';
import { AuthResponseDTO } from 'src/common/dtos/response/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private accountService: AccountService,
  ) {}
  async signin(payload: SigninDTO): Promise<AuthResponseDTO> {
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
    const defaultAccount = await this.accountService.getDefaultAccountByUserId(
      existingUser.userId,
    );
    const jwtPayload = {
      sub: existingUser.userId,
      username: existingUser.name,
      userId: existingUser.userId,
    };
    const jwt = await this.jwtService.signAsync(jwtPayload);
    return { jwt, accountId: defaultAccount.accountId, ...existingUser };
  }

  async signup(payload: CreateUserDTO): Promise<AuthResponseDTO> {
    try {
      const existingUser = await this.userService.findOneBy(
        'email',
        payload.email,
      );
      if (existingUser) throw new BadRequestException('user already exist');
      const hash = await this.hashPassword(payload.password);
      payload.password = hash;

      const user = await this.userService.create({ ...payload });
      console.log({ user }, 'here user created');
      const account = await this.accountService.create(user.userId, {
        title: 'Salary',
        isDefault: true,
        balance: 0,
      });
      const jwtPayload = {
        sub: user.userId,
        username: user.name,
        userId: user.userId,
      };
      const jwt = await this.jwtService.signAsync(jwtPayload);
      return { jwt, accountId: account.accountId, ...user };
    } catch (e) {
      console.error(e);
      throw e;
    }
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
