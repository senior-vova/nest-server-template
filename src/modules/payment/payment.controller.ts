import { Body, Req, Res } from "@nestjs/common";
import { Request, Response } from "express";
import { Endpoint, SuperController } from "src/helpers/decorators";
import { ReturnOK } from "src/helpers/responses";
import { RequestI } from "src/helpers/utils";
import { CreatePaymentIntentDto } from "./payment.dto";
import { PaymentService } from "./payment.service";

@SuperController("payment")
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Endpoint("POST", "balance", "USER")
  async CreatePaymentIntent(
    @Req() req: RequestI,
    @Body() body: CreatePaymentIntentDto,
    @Res() res: Response,
  ) {
    const url = await this.paymentService.getPaymentIntentClientSecret(
      String(req.user.id),
      body.amount,
    );
    return ReturnOK(res, { url });
  }

  @Endpoint("POST", "check-payment-intent/webhook", "NONE", { useCatch: false })
  async CheckPaymentIntent(@Req() req: Request, @Res() res: Response) {
    try {
      await this.paymentService.checkPaymentIntent(req);
      return ReturnOK(res);
    } catch (err) {
      return res.status(400).send(`Webhook Error: ${err?.message}`);
    }
  }
}
