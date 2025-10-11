import { Module } from '@nestjs/common';
import { AccountController } from './controllers/account.controller';
import { AccountService } from './services/account.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [],
  controllers: [AccountController],
  providers: [AccountService],
  exports: [AccountService],
})
export class AccountModule {}
