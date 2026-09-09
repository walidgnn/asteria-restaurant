import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { PrismaModule } from "./prisma/prisma.module";
import { MenuModule } from "./menu/menu.module";
import { AuthModule } from "./auth/auth.module";
import { OrdersModule } from "./orders/orders.module";
import { ReservationsModule } from "./reservations/reservations.module";
import { PaymentsModule } from "./payments/payments.module";
import { AdminAuthModule } from "./admin-auth/admin-auth.module";

@Module({
    imports: [PrismaModule, MenuModule, AuthModule, OrdersModule, ReservationsModule, PaymentsModule, AdminAuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}