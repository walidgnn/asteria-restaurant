import { Module } from "@nestjs/common";
import { AdminCategoriesController } from "./admin-categories.controller";
import { AdminCategoriesService } from "./admin-categories.service";
import { AdminDishesController } from "./admin-dishes.controller";
import { AdminDishesService } from "./admin-dishes.service";
import { AdminCustomizationsController } from "./admin-customizations.controller";
import { AdminCustomizationsService } from "./admin-customizations.service";
import { AdminAuthModule } from "../admin-auth/admin-auth.module";

@Module({
  imports: [AdminAuthModule],
  controllers: [AdminCategoriesController, AdminDishesController, AdminCustomizationsController],
  providers: [AdminCategoriesService, AdminDishesService, AdminCustomizationsService],
})
export class AdminMenuModule {}