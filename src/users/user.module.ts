import { Module } from '@nestjs/common';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController, AuthController],
  providers: [UserService, AuthService],
})
export class UserModule {}
