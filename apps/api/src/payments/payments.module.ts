import { Module } from "@nestjs/common";
import { PaymentsController } from "./payments.controller";
import { PaymentsService } from "./payments.service";
import { StripeService } from "./stripe.service";
import { AuthModule } from "../auth/auth.module";

@Module({
  imports: [AuthModule],
  controllers: [PaymentsController],
  providers: [PaymentsService, StripeService],
})
export class PaymentsModule {}