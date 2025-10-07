import { UseInterceptors } from '@nestjs/common';
import {
  SerializeInterceptor,
  ClassConstructor,
} from 'src/interceptor/serialize.interceptor';

export const Serialize = <T>(dto: ClassConstructor<T>) => {
  return UseInterceptors(new SerializeInterceptor(dto));
};
