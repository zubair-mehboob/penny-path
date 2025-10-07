import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';
import { User } from '../user.entity';

export class CreateUserDTO {
  @IsString()
  name: string;
  @IsEmail()
  email: string;
  @IsString()
  @MinLength(3)
  @MaxLength(5)
  password: string;
}
