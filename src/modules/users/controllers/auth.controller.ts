import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { Serialize } from 'src/common/decorator/serialize.decorator';
import { Public } from 'src/common/decorator/public.decorator';
import { SigninDTO } from 'src/common/dtos/request/auth.dto';
import { CreateUserDTO } from 'src/common/dtos/request/user.dto';
import { AuthResponseDTO } from 'src/common/dtos/response/auth.dto';
@Public()
@Serialize(AuthResponseDTO)
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('/signin')
  signin(@Body() dto: SigninDTO) {
    return this.authService.signin(dto);
  }

  @Post('/signup')
  signup(@Body() dto: CreateUserDTO) {
    return this.authService.signup(dto);
  }
}
