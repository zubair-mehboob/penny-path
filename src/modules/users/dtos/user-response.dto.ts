import { Exclude, Expose } from 'class-transformer';

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
