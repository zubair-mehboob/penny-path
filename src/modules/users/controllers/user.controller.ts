import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { Serialize } from 'src/common/decorator/serialize.decorator';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { Authenticated } from 'src/common/decorator/authenticate.decorator';
import { CreateUserDTO, UpdateUserDto } from 'src/common/dtos/request/user.dto';
import { UserResponseDTO } from 'src/common/dtos/response/user.dto';
@Authenticated()
@Serialize(UserResponseDTO)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getUsers() {
    return this.userService.findAll();
  }

  @Get('/:id')
  getById(@Param('id') id: number) {
    return this.userService.findOneBy('userId', id);
  }

  @Post()
  create(@Body() dto: CreateUserDTO) {
    return this.userService.create(dto);
  }

  @Put('/:id')
  update(@Param('id') id: number, @Body() dto: UpdateUserDto) {
    return this.userService.update(id, dto);
  }

  @Delete('/:id')
  remove(@Param('id') id: number) {
    return this.userService.remove(id);
  }
}
