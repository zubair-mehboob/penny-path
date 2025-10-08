import { UseInterceptors } from '@nestjs/common';
import {
  SerializeInterceptor,
  ClassConstructor,
} from 'src/common/interceptor/serialize.interceptor';

export const Serialize = <T>(dto: ClassConstructor<T>) => {
  return UseInterceptors(new SerializeInterceptor(dto));
};
