import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { User } from '../user.entity';
import { CreateUserDTO } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { Serialize } from 'src/decorator/serialize.decorator';
import { UserResponseDTO } from '../dtos/user-response.dto';

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
