import { applyDecorators } from "@nestjs/common";
import { isBoolean } from "class-validator";
import { Roles } from "../guards/role.guard";
import { Auth, GenerateInterceptors, GenerateMethod, UseCatch } from "./endpoint.helpers";

type MethodString = "POST" | "GET" | "PUT" | "PATCH" | "DELETE";
type RoleString = "ADMIN" | "USER" | "NONE";
type Roles = Array<"ADMIN" | "USER">;

type ConfigsType = {
  roles?: Roles;
  fileInterceptor?: string;
  useCatch?: boolean;
};

const defaultConfigs: ConfigsType = {
  roles: [],
  fileInterceptor: null,
  useCatch: true,
};

function Endpoint(
  method: MethodString,
  path: string = "",
  role: RoleString = "USER",
  { roles, fileInterceptor, useCatch }: ConfigsType = defaultConfigs,
) {
  roles = roles || [];
  fileInterceptor = fileInterceptor || null;
  useCatch = isBoolean(useCatch) ? useCatch : true;

  return applyDecorators(
    UseCatch(useCatch),
    GenerateMethod(method, path),
    Auth(role),
    Roles(roles),
    GenerateInterceptors(fileInterceptor),
  );
}

export default Endpoint;
