import { buildMessage, max, min, ValidateBy, ValidationArguments } from "class-validator";

export default function IsTime(): PropertyDecorator {
  return ValidateBy({
    name: "IS_RIGHT_TIME",
    validator: {
      validate: (value: any) => {
        if (value) {
          const time = String(value).trim();
          const [hour, minute] = time.split(":");
          if (!hour || !minute) return false;
          if (!min(+hour, 0) || !max(+hour, 23)) return false;
          if (!min(+minute, 0) || !max(+minute, 59)) return false;
          return true;
        } else {
          return true;
        }
      },
      defaultMessage: buildMessage(
        (eachPrefix: string, args: ValidationArguments) =>
          args.property + " must be hh:mm format time",
      ),
    },
  });
}
