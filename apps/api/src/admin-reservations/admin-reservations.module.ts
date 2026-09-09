import { Module } from "@nestjs/common";
import { AdminReservationsController } from "./admin-reservations.controller";
import { AdminReservationsService } from "./admin-reservations.service";
import { AdminAuthModule } from "../admin-auth/admin-auth.module";

@Module({
  imports: [AdminAuthModule],
  controllers: [AdminReservationsController],
  providers: [AdminReservationsService],
})
export class AdminReservationsModule {}