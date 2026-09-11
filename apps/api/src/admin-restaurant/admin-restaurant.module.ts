import { Module } from "@nestjs/common";
import { AdminRestaurantController } from "./admin-restaurant.controller";
import { AdminRestaurantService } from "./admin-restaurant.service";
import { AdminAuthModule } from "../admin-auth/admin-auth.module";

@Module({
  imports: [AdminAuthModule],
  controllers: [AdminRestaurantController],
  providers: [AdminRestaurantService],
})
export class AdminRestaurantModule {}