import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { AccountService } from '../services/account.service';
import { CreateAccountDTO } from 'src/common/dtos/request/account.dto';
import { Authenticated } from 'src/common/decorator/authenticate.decorator';
import { Serialize } from 'src/common/decorator/serialize.decorator';
import { AccountResponseDTO } from 'src/common/dtos/response/account.dto';
import { UserId } from 'src/common/decorator/user-id.decorator';
@Authenticated()
@Controller('accounts')
export class AccountController {
  constructor(private accountService: AccountService) {}

  @Post()
  create(@UserId() userId: number, @Body() dto: CreateAccountDTO) {
    return this.accountService.create(userId, dto);
  }

  @Get()
  getAll(@UserId() userId: number) {
    return this.accountService.getAll(userId);
  }

  @Serialize(AccountResponseDTO)
  @Get('get-default')
  getDefaultAccountByUserId(@UserId() userId: number) {
    return this.accountService.getDefaultAccountByUserId(userId);
  }

  @Serialize(AccountResponseDTO)
  @Patch('/:id/set-default')
  setDefaultAccount(@Param('id') id: number) {
    return this.accountService.setDefaultAccountById(id);
  }
}
