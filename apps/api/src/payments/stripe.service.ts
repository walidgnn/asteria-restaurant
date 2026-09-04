import { Injectable } from "@nestjs/common";
import Stripe from "stripe";

@Injectable()
export class StripeService {
  public client: Stripe;

  constructor() {
    this.client = new Stripe(process.env.STRIPE_SECRET_KEY!);
  }
}