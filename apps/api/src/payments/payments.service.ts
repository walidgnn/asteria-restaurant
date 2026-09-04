import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { StripeService } from "./stripe.service";

@Injectable()
export class PaymentsService {
  constructor(
    private prisma: PrismaService,
    private stripe: StripeService
  ) {}

  async createPaymentIntent(customerId: string, orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { payment: true },
    });

    if (!order) throw new NotFoundException("Order not found.");
    if (order.customerId !== customerId) {
      throw new ForbiddenException("This order does not belong to you.");
    }

    // Stripe expects the amount in the smallest currency unit (cents for EUR)
    const amountInCents = Math.round(Number(order.totalAmount) * 100);

    const intent = await this.stripe.client.paymentIntents.create({
      amount: amountInCents,
      currency: "eur",
      metadata: { orderId: order.id },
    });

    await this.prisma.payment.upsert({
      where: { orderId: order.id },
      update: { transactionRef: intent.id },
      create: {
        orderId: order.id,
        amount: order.totalAmount,
        method: "CARD",
        status: "PENDING",
        transactionRef: intent.id,
      },
    });

    return { clientSecret: intent.client_secret };
  }

  async confirmPayment(customerId: string, orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { payment: true },
    });
    if (!order) throw new NotFoundException("Order not found.");
    if (order.customerId !== customerId) {
      throw new ForbiddenException("This order does not belong to you.");
    }
    if (!order.payment?.transactionRef) {
      throw new NotFoundException("No payment found for this order.");
    }

    const intent = await this.stripe.client.paymentIntents.retrieve(
      order.payment.transactionRef
    );

    if (intent.status === "succeeded") {
      await this.prisma.payment.update({
        where: { orderId: order.id },
        data: { status: "SUCCEEDED" },
      });
      await this.prisma.order.update({
        where: { id: order.id },
        data: {
          status: "CONFIRMED",
          statusHistory: {
            create: { status: "CONFIRMED", note: "Payment received." },
          },
        },
      });
    }

    return { status: intent.status };
  }
}