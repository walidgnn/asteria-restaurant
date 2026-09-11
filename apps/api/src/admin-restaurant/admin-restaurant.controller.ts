import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { AdminJwtAuthGuard } from "../admin-auth/admin-jwt-auth.guard";
import { PermissionsGuard } from "../admin-auth/permissions.guard";
import { RequirePermissions } from "../admin-auth/permissions.decorator";
import { AdminRestaurantService } from "./admin-restaurant.service";

@UseGuards(AdminJwtAuthGuard, PermissionsGuard)
@Controller("admin/restaurant")
export class AdminRestaurantController {
  constructor(private restaurantService: AdminRestaurantService) {}

  @RequirePermissions("restaurant.view")
  @Get("info")
  getInfo() {
    return this.restaurantService.getInfo();
  }

  @RequirePermissions("restaurant.manage")
  @Patch("info")
  updateInfo(@Body() dto: any) {
    return this.restaurantService.updateInfo(dto);
  }

  @RequirePermissions("restaurant.view")
  @Get("hours")
  getHours() {
    return this.restaurantService.getHours();
  }

  @RequirePermissions("restaurant.manage")
  @Patch("hours")
  updateHours(@Body() dto: any) {
    return this.restaurantService.updateHours(dto);
  }

  @RequirePermissions("restaurant.view")
  @Get("gallery")
  getGallery(@Query("section") section?: string) {
    return this.restaurantService.getGallery(section);
  }

  @RequirePermissions("restaurant.manage")
  @Post("gallery")
  addImage(@Body() dto: any) {
    return this.restaurantService.addImage(dto);
  }

  @RequirePermissions("restaurant.manage")
  @Patch("gallery/:id")
  updateImage(@Param("id") id: string, @Body() dto: any) {
    return this.restaurantService.updateImage(id, dto);
  }

  @RequirePermissions("restaurant.manage")
  @Delete("gallery/:id")
  removeImage(@Param("id") id: string) {
    return this.restaurantService.removeImage(id);
  }
}