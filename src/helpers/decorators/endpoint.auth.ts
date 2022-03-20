import { applyDecorators } from "@nestjs/common";
import { GenerateMethod } from "./endpoint.helpers";

type MethodString = "POST" | "GET" | "PUT" | "PATCH" | "DELETE";

export default function (method: MethodString, path: string = "") {
  return applyDecorators(GenerateMethod(method, path));
}
