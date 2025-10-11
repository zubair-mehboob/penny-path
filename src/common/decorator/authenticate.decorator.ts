import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../guard/auth.guard';

export const Authenticated = () => {
  return applyDecorators(UseGuards(AuthGuard));
};
