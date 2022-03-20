import { buildMessage, ValidateBy, ValidationArguments } from "class-validator";
import * as moment from "moment";

export default function IsNewDate(): PropertyDecorator {
  return ValidateBy({
    name: "IS_NEW_DATE",
    validator: {
      validate: (value: any) => {
        if (value) {
          if (moment(new Date()).diff(moment(value), "minutes") > 0) {
            return false;
          }
          return true;
        } else {
          return true;
        }
      },
      defaultMessage: buildMessage(
        (eachPrefix: string, args: ValidationArguments) => args.property + " must be a new date",
      ),
    },
  });
}
