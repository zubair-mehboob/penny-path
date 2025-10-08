import { Controller, Get } from '@nestjs/common';
import { AccountService } from '../services/account.service';
@Controller('accounts')
export class AccountController {
  constructor(private accountService: AccountService) {}
}
