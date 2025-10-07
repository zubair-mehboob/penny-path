import { Exclude, Expose } from 'class-transformer';
import { User } from '../user.entity';

export class UserResponseDTO {
  @Expose()
  userId: number;
  @Expose()
  name: string;
  @Expose()
  email: string;
  @Exclude()
  password: string;
}
