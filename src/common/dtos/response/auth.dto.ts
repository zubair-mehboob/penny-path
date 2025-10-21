import { Exclude, Expose } from 'class-transformer';

export class AuthResponseDTO {
  @Expose()
  userId: number;
  @Expose()
  name: string;
  @Expose()
  email: string;
  @Expose()
  jwt: string;
  @Expose()
  accountId: number;
  @Exclude()
  password: string;
}
