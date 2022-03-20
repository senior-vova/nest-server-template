import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import * as types from "./services/interface";
import { Model } from "mongoose";
import { StripeService } from "./services/stripe.service";
import { RequestI } from "src/helpers/utils";
import { MailService } from "src/mail/mail.service";
import { MessagesTypesEnum } from "src/mail/mail.data";
import { NotificationsService } from "src/notification/notification.service";
import Stripe from "stripe";
import { ConfigService } from "@nestjs/config";
import { User, UserDocument } from "src/models/users.model";

@Injectable()
export class PaymentService {
  private readonly ServerUrl: string;
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
    private readonly stripeService: StripeService,
    private readonly mailService: MailService,
    private readonly notificationsService: NotificationsService,
    private readonly configService: ConfigService,
  ) {
    this.ServerUrl = configService.get("SERVER_URL");
  }

  public async getPaymentIntentClientSecret(userId: string, amount: number): Promise<string> {
    const user = await this.userModel.findById(userId);
    let stripeCustomerId: string = "";
    if (user.privateInfo.stripeCustomerId) {
      stripeCustomerId = user.privateInfo.stripeCustomerId;
    } else {
      stripeCustomerId = await this.stripeService.getCustomerId(userId, user.name, user.email);
    }
    const url = await this.stripeService.createPaymentIntent(stripeCustomerId, user.email, amount, {
      userId,
      action: "replenish",
      email: user.email,
    });
    return url;
  }

  public async checkPaymentIntent(request: RequestI) {
    const sig = request.headers["stripe-signature"];
    let event: Stripe.Event;
    try {
      event = this.stripeService.getWebhookEvent(request.body, sig);
    } catch (error) {
      return Promise.reject(error);
    }
    const paymentCreated = event.data.object;
    // console.log(event.type, paymentCreated);
    switch (event.type) {
      case "checkout.session.completed":
        // When session form success filled.
        await this.checkPayment(paymentCreated);
        return Promise.resolve();
      case "checkout.session.async_payment_succeeded":
        // Fulfill the purchased goods or services.
        await this.checkPayment(paymentCreated);
        return Promise.resolve();
      case "checkout.session.async_payment_failed":
        // The payment was declined, or failed for some other reason.
        await this.failPayment(paymentCreated);
        return Promise.resolve();
      default:
        // console.log(`Unhandled event type ${event.type}`);
        return Promise.resolve();
    }
  }

  private async checkPayment(paymentCreated: any): Promise<void> {
    if (paymentCreated["payment_status"] === "paid") {
      const metadata: types.TMetadata = paymentCreated["metadata"];
      if (metadata.action === "replenish") {
        const data: types.IActionReplenish = paymentCreated["metadata"];
        await Promise.all([
          this.addUserBalance(data.userId, paymentCreated["amount_total"]),
          this.mailService.sendMailMsg(data["email"], MessagesTypesEnum.successPayment, ""),
        ]);
      }
    }
    return Promise.resolve();
  }

  private async failPayment(paymentCreated: any): Promise<void> {
    const metadata: types.TMetadata = paymentCreated["metadata"];
    if (metadata.userId) {
      const user = await this.userModel.findById(metadata.userId);
      if (user) this.mailService.sendMailMsg(user.email, MessagesTypesEnum.failPayment, "");
    }
    return Promise.resolve();
  }

  private async addUserBalance(userId: string, amount: string) {
    return this.userModel.findByIdAndUpdate(
      userId,
      {
        $inc: { balance: +amount / 100 },
      },
      { new: true },
    );
  }
}
