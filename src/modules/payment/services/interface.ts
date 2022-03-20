import Stripe from "stripe";

export interface IActionReplenish extends Stripe.MetadataParam {
  action: "replenish";
  userId: string;
  email: string;
}

export type TMetadata = IActionReplenish;
