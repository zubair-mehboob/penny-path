import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { SigninDTO } from '../dtos/sign-in.dto';
import { CreateUserDTO } from '../dtos/create-user.dto';
import { AuthService } from '../services/auth.service';
import { Serialize } from 'src/decorator/serialize.decorator';
import { AuthResponseDTO } from '../dtos/auth-response.dto';
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
