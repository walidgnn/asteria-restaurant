import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const required = this.reflector.get<string[]>("permissions", context.getHandler());
    if (!required || required.length === 0) return true;

    const { user } = context.switchToHttp().getRequest();
    const hasAll = required.every((p) => user?.permissions?.includes(p));
    if (!hasAll) {
      throw new ForbiddenException("You don't have permission to perform this action.");
    }
    return true;
  }
}