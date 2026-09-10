import { Module } from "@nestjs/common";
import { AdminCategoriesController } from "./admin-categories.controller";
import { AdminCategoriesService } from "./admin-categories.service";
import { AdminDishesController } from "./admin-dishes.controller";
import { AdminDishesService } from "./admin-dishes.service";
import { AdminAuthModule } from "../admin-auth/admin-auth.module";

@Module({
  imports: [AdminAuthModule],
  controllers: [AdminCategoriesController, AdminDishesController],
  providers: [AdminCategoriesService, AdminDishesService],
})
export class AdminMenuModule {}