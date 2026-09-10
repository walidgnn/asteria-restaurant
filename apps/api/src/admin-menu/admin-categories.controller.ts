import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { AdminJwtAuthGuard } from "../admin-auth/admin-jwt-auth.guard";
import { PermissionsGuard } from "../admin-auth/permissions.guard";
import { RequirePermissions } from "../admin-auth/permissions.decorator";
import { AdminCategoriesService } from "./admin-categories.service";

@UseGuards(AdminJwtAuthGuard, PermissionsGuard)
@Controller("admin/menu/categories")
export class AdminCategoriesController {
  constructor(private categoriesService: AdminCategoriesService) {}

  @RequirePermissions("menu.view")
  @Get()
  findAll(@Query("search") search?: string) {
    return this.categoriesService.findAll(search);
  }

  @RequirePermissions("menu.manage")
  @Post()
  create(@Body() dto: { name: string; description?: string }) {
    return this.categoriesService.create(dto);
  }

  @RequirePermissions("menu.manage")
  @Patch(":id")
  update(@Param("id") id: string, @Body() dto: any) {
    return this.categoriesService.update(id, dto);
  }

  @RequirePermissions("menu.manage")
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.categoriesService.remove(id);
  }
}