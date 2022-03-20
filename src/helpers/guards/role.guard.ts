import { ExecutionContext, Injectable, SetMetadata } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { IsAdmin, IsUser } from "../users/roles";
import { RequestI } from "../utils";

type ValidateRoleString = "ADMIN" | "USER";

export const Roles = (roles: ValidateRoleString[]) => SetMetadata("roles", roles);

@Injectable()
export class RoleValidateGuard {
  private validateRoles: ValidateRoleString[];
  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean | Observable<boolean>> {
    const request: RequestI = context.switchToHttp().getRequest();
    this.validateRoles = this.reflector.get<ValidateRoleString[]>("roles", context.getHandler());
    if (request.userDoc) {
      const user = request.userDoc;
      if (user) {
        if (this.validateRoles?.length) {
          for (const role of this.validateRoles) {
            if (role == "ADMIN") {
              if (this.validateRoles.includes("ADMIN")) {
                if (!IsAdmin(user)) return Promise.resolve(false);
              }
            } else if (role == "USER") {
              if (this.validateRoles.includes("USER")) {
                if (!IsUser(user)) return Promise.resolve(false);
              }
            }
          }
          return Promise.resolve(true);
        } else {
          return Promise.resolve(true);
        }
      }
    }
    return Promise.resolve(false);
  }
}
