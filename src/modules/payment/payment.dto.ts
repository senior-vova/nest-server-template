import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, Max, Min } from "class-validator";

export class CreatePaymentIntentDto {
  @ApiProperty()
  @IsNumber()
  @Min(5, { message: "Amount should be great or equal than 5$" })
  @Max(500, { message: "Amount should be less or equal than 500$" })
  readonly amount: number;
}
