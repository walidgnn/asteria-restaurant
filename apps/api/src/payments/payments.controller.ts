import { Body, Controller, Post, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { PaymentsService } from "./payments.service";

@UseGuards(JwtAuthGuard)
@Controller("payments")
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @Post("create-intent")
  createIntent(@Req() req: any, @Body() body: { orderId: string }) {
    return this.paymentsService.createPaymentIntent(req.user.id, body.orderId);
  }

  @Post("confirm")
  confirm(@Req() req: any, @Body() body: { orderId: string }) {
    return this.paymentsService.confirmPayment(req.user.id, body.orderId);
  }
}