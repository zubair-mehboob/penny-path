import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { AccountService } from '../services/account.service';
import { CreateAccountDTO } from 'src/common/dtos/request/account.dto';
import { Authenticated } from 'src/common/decorator/authenticate.decorator';
@Authenticated()
@Controller('accounts')
export class AccountController {
  constructor(private accountService: AccountService) {}

  @Post()
  create(@Body() dto: CreateAccountDTO) {
    return this.accountService.create(dto);
  }

  @Get()
  getAll(@Query('userId') userId: number) {
    return this.accountService.getAll(userId);
  }
}
