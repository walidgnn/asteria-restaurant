import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { AdminJwtAuthGuard } from "../admin-auth/admin-jwt-auth.guard";
import { PermissionsGuard } from "../admin-auth/permissions.guard";
import { RequirePermissions } from "../admin-auth/permissions.decorator";
import { AdminDishesService } from "./admin-dishes.service";

@UseGuards(AdminJwtAuthGuard, PermissionsGuard)
@Controller("admin/menu/dishes")
export class AdminDishesController {
  constructor(private dishesService: AdminDishesService) {}

  @RequirePermissions("menu.view")
  @Get()
  findAll(
    @Query("categoryId") categoryId?: string,
    @Query("isAvailable") isAvailable?: string,
    @Query("isFeatured") isFeatured?: string,
    @Query("search") search?: string
  ) {
    return this.dishesService.findAll({ categoryId, isAvailable, isFeatured, search });
  }

  @RequirePermissions("menu.view")
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.dishesService.findOne(id);
  }

  @RequirePermissions("menu.manage")
  @Post()
  create(@Body() dto: any) {
    return this.dishesService.create(dto);
  }

  @RequirePermissions("menu.manage")
  @Patch(":id")
  update(@Param("id") id: string, @Body() dto: any) {
    return this.dishesService.update(id, dto);
  }

  @RequirePermissions("menu.manage")
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.dishesService.remove(id);
  }
}