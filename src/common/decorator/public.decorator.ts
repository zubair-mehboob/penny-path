/**
 * SetMetadata() = adds some hidden "tags" to a route
Reflector.get() = reads those tags later inside a guard
Example — @Public() Decorator
You created
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
Now when you use
@Public()
@Post('signin')
signIn(@Body() dto: any) { ... }
Nest stores a small piece of metadata for this route:
// Pseudo representation
{
  handler: "signIn",
  metadata: { isPublic: true }
}
So this does not affect the request or the HTTP flow — it just attaches data to that route.
In your AuthGuard, you read it using the Reflector
const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
  context.getHandler(),
  context.getClass(),
]);
“Hey Nest, check if the current route (handler) or its controller (class) has metadata called 'isPublic'.”
If it finds true, the guard skips authentication.
 */
import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = Symbol('isPublic');
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
