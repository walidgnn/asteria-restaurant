import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { AdminJwtAuthGuard } from "../admin-auth/admin-jwt-auth.guard";
import { PermissionsGuard } from "../admin-auth/permissions.guard";
import { RequirePermissions } from "../admin-auth/permissions.decorator";
import { AdminCustomizationsService } from "./admin-customizations.service";

@UseGuards(AdminJwtAuthGuard, PermissionsGuard)
@Controller("admin/menu/customizations")
export class AdminCustomizationsController {
  constructor(private customizationsService: AdminCustomizationsService) {}

  @RequirePermissions("menu.view")
  @Get()
  findAll(@Query("search") search?: string) {
    return this.customizationsService.findAll(search);
  }

  @RequirePermissions("menu.manage")
  @Post()
  create(@Body() dto: any) {
    return this.customizationsService.create(dto);
  }

  @RequirePermissions("menu.manage")
  @Patch(":id")
  update(@Param("id") id: string, @Body() dto: any) {
    return this.customizationsService.update(id, dto);
  }

  @RequirePermissions("menu.manage")
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.customizationsService.remove(id);
  }

  @RequirePermissions("menu.manage")
  @Post(":id/options")
  addOption(@Param("id") id: string, @Body() dto: any) {
    return this.customizationsService.addOption(id, dto);
  }

  @RequirePermissions("menu.manage")
  @Patch("options/:optionId")
  updateOption(@Param("optionId") optionId: string, @Body() dto: any) {
    return this.customizationsService.updateOption(optionId, dto);
  }

  @RequirePermissions("menu.manage")
  @Delete("options/:optionId")
  removeOption(@Param("optionId") optionId: string) {
    return this.customizationsService.removeOption(optionId);
  }
}