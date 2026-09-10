import { Body, Controller, Get, Param, Patch, Query, UseGuards } from "@nestjs/common";
import { AdminJwtAuthGuard } from "../admin-auth/admin-jwt-auth.guard";
import { PermissionsGuard } from "../admin-auth/permissions.guard";
import { RequirePermissions } from "../admin-auth/permissions.decorator";
import { AdminCustomersService } from "./admin-customers.service";

@UseGuards(AdminJwtAuthGuard, PermissionsGuard)
@Controller("admin/customers")
export class AdminCustomersController {
  constructor(private customersService: AdminCustomersService) {}

  @RequirePermissions("customers.view")
  @Get()
  findAll(@Query("search") search?: string, @Query("page") page?: string) {
    return this.customersService.findAll({ search, page: page ? parseInt(page) : 1 });
  }

  @RequirePermissions("customers.view")
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.customersService.findOne(id);
  }

  @RequirePermissions("customers.manage")
  @Patch(":id")
  update(@Param("id") id: string, @Body() dto: any) {
    return this.customersService.update(id, dto);
  }

  @RequirePermissions("customers.manage")
  @Patch(":id/notes")
  updateNotes(@Param("id") id: string, @Body() body: { staffNotes: string }) {
    return this.customersService.updateNotes(id, body.staffNotes);
  }

  @RequirePermissions("customers.manage")
  @Patch(":id/vip")
  toggleVip(@Param("id") id: string) {
    return this.customersService.toggleVip(id);
  }
}