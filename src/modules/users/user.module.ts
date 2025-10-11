import { forwardRef, Module } from '@nestjs/common';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../common/entities/user.entity';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { AccountModule } from '../accounts/account.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), forwardRef(() => AccountModule)],
  controllers: [UserController, AuthController],
  providers: [
    UserService,
    AuthService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    AuthGuard,
  ],
  exports: [UserService],
})
export class UserModule {}
