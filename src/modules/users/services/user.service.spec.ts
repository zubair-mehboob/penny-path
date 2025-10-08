import { Test } from '@nestjs/testing';
import { UserModule } from '../user.module';
import { UserService } from './user.service';
import { User } from '../user.entity';
import { BadRequestException } from '@nestjs/common';
describe('', () => {
  let service: UserService;
  beforeEach(async () => {
    const users: User[] = [];
    const FakeUserService: Partial<UserService> = {
      findAll: function (): Promise<User[]> {
        return Promise.resolve(users);
      },
      findOneBy: function (
        key: keyof Omit<User, 'password'>,
        value: any,
      ): Promise<User> {
        return Promise.resolve(users.find((item: User) => item[key] === value));
      },
      create: async function (payload: Omit<User, 'userId'>): Promise<User> {
        const existingUser = await FakeUserService.findOneBy(
          'email',
          payload.email,
        );
        if (existingUser) throw new BadRequestException('user already exist');
        const user = { userId: Math.round(Math.random()), ...payload };
        users.push(user);
        return Promise.resolve(user);
      },
      update: async function (
        userId: number,
        payload: Partial<User>,
      ): Promise<User> {
        const existingUser = await FakeUserService.findOneBy(
          'userId',
          payload.userId,
        );
        if (!existingUser) throw new BadRequestException('user does not exist');
        const index = users.findIndex((item: User) => item.userId === userId);
        Object.assign(existingUser, payload);
        users[index] = existingUser;
        return Promise.resolve(existingUser);
      },
      remove: async function (userId: number): Promise<boolean> {
        const existingUser = await FakeUserService.findOneBy('userId', userId);
        if (!existingUser) throw new BadRequestException('user does not exist');
        const index = users.findIndex((item: User) => item.userId === userId);
        users.splice(index, 1);
        return true;
      },
    };
    const module = Test.createTestingModule({
      providers: [
        {
          provide: UserService,
          useValue: FakeUserService,
        },
      ],
    }).compile();
    service = (await module).get<UserService>(UserService);
  });
  it('can create instance of UerService', async () => {
    expect(service).toBeDefined();
  });
  it('can create user', async () => {
    const user = await service.create({
      email: 'a@y.com',
      name: 'xyz',
      password: 'abcdefg',
    });
    expect(user.userId).toBeDefined();
    expect(user.email).toEqual('a@y.com');
  });
});
