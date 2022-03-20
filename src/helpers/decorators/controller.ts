import { applyDecorators, Controller } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

export default function (prefix: string = "") {
  return applyDecorators(Controller(prefix), ApiTags(prefix || "default"));
}
