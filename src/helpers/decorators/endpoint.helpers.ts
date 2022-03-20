import {
  applyDecorators,
  Delete,
  Get,
  Patch,
  Post,
  Put,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { ApiBearerAuth, ApiConsumes } from "@nestjs/swagger";
import { HttpExceptionFilter } from "../filters/try-catch";
import { RoleValidateGuard } from "../guards/role.guard";
import { UserAuthGuard } from "../guards/user.guard";
import { CreateFileInterceptor } from "../interceptors/file.interceptor";

type MethodString = "POST" | "GET" | "PUT" | "PATCH" | "DELETE";

export const GenerateMethod = (method: MethodString, path: string) => {
  if (method == "GET") {
    return applyDecorators(Get(path));
  } else if (method == "POST") {
    return applyDecorators(Post(path));
  } else if (method == "PATCH") {
    return applyDecorators(Patch(path));
  } else if (method == "PUT") {
    return applyDecorators(Put(path));
  } else if (method == "DELETE") {
    return applyDecorators(Delete(path));
  }
};

export const GenerateInterceptors = (fileInterceptor: string) => {
  if (fileInterceptor) {
    return applyDecorators(
      UseInterceptors(CreateFileInterceptor(fileInterceptor)),
      ApiConsumes("multipart/form-data"),
    );
  } else {
    return applyDecorators();
  }
};

export const UseCatch = (useCatch: boolean) => {
  if (useCatch) {
    return applyDecorators(UseFilters(HttpExceptionFilter));
  } else {
    return applyDecorators();
  }
};

type RoleString = "ADMIN" | "USER" | "NONE";

export const Auth = (role: RoleString) => {
  if (role == "USER") {
    const guards = [UserAuthGuard, RoleValidateGuard];
    return applyDecorators(ApiBearerAuth(), UseGuards(...guards));
  } else if (role == "NONE") {
    return applyDecorators();
  }
};
