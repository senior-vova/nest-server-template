import { buildMessage, ValidateBy, ValidationArguments } from "class-validator";
import { isValidObjectId } from "mongoose";

export default function IsValidObjectId(): PropertyDecorator {
  return ValidateBy({
    name: "IS_OBJECT_ID",
    validator: {
      validate: (value: any) => (value ? isValidObjectId(value) : true),
      defaultMessage: buildMessage(
        (eachPrefix: string, args: ValidationArguments) => args.property + " must be ObjectId",
      ),
    },
  });
}
