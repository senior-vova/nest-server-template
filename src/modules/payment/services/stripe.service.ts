import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { UserDocument } from "src/models/users.model";
import Stripe from "stripe";
import * as Interface from "./interface";

@Injectable()
export class StripeService {
  private readonly stripe: Stripe;
  private readonly webhookSecret: string;
  private readonly stripeSecret: string;
  private readonly successUrl: string;
  private readonly failedUrl: string;

  constructor(
    @InjectModel("UserModel")
    private readonly userModel: Model<UserDocument>,
    private _configs: ConfigService,
  ) {
    this.webhookSecret = _configs.get("STRIPE_WEBHOOK_SECRET");
    this.successUrl = _configs.get("STRIPE_SUCCESS_ENDPOINT");
    this.failedUrl = _configs.get("STRIPE_FAILED_ENDPOINT");
    this.stripeSecret = _configs.get("STRIPE_SECRET_KEY");
    this.stripe = new Stripe(this.stripeSecret, { apiVersion: "2020-08-27" });
  }

  public async getCustomerId(userId: string, name?: string, email?: string): Promise<string> {
    try {
      const user = await this.userModel.findById(userId);
      if (user) {
        if (user.privateInfo.stripeCustomerId) {
          return user.privateInfo.stripeCustomerId;
        } else {
          const customer = await this.stripe.customers.create({ name, email });
          await this.userModel.findByIdAndUpdate(userId, {
            $set: { "privateInfo.stripeCustomerId": customer.id },
          });
          return customer.id;
        }
      } else {
        return "";
      }
    } catch (error) {
      return "";
    }
  }

  public async getCustomerIdByEmail(email: string) {
    let customer: Stripe.Customer;
    const customers = await this.stripe.customers.list({ email });
    if (customers.data && customers.data.length) {
      customer = customers.data[0];
    } else {
      customer = await this.stripe.customers.create({ email });
    }
    return customer.id;
  }

  public async createPaymentIntent(
    customerId: string,
    email: string,
    amount: number,
    metadata: Interface.TMetadata,
    success_url: string = this.successUrl,
    cancel_url: string = this.failedUrl,
  ): Promise<string> {
    const sessions = await this.stripe.checkout.sessions.create({
      line_items: [
        {
          amount: amount * 100,
          currency: "usd",
          name: metadata.action,
          quantity: 1,
        },
      ],
      mode: "payment",
      customer: customerId,
      metadata: {
        ...metadata,
        email,
      },
      success_url,
      cancel_url,
    });
    return sessions.url;
  }

  public getWebhookEvent(rawBody: any, signature: any) {
    return this.stripe.webhooks.constructEvent(rawBody, signature, this.webhookSecret);
  }
}
