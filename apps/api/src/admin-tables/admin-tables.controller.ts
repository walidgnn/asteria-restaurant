import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";
import { AdminJwtAuthGuard } from "../admin-auth/admin-jwt-auth.guard";
import { PermissionsGuard } from "../admin-auth/permissions.guard";
import { RequirePermissions } from "../admin-auth/permissions.decorator";
import { AdminTablesService } from "./admin-tables.service";

@UseGuards(AdminJwtAuthGuard, PermissionsGuard)
@Controller("admin/tables")
export class AdminTablesController {
  constructor(private tablesService: AdminTablesService) {}

  @RequirePermissions("tables.view")
  @Get()
  findAll(@Query("status") status?: string) {
    return this.tablesService.findAll(status);
  }

  @RequirePermissions("tables.manage")
  @Post()
  create(@Body() dto: { number: string; capacity: number }) {
    return this.tablesService.create(dto);
  }

  @RequirePermissions("tables.manage")
  @Patch(":id")
  update(@Param("id") id: string, @Body() dto: any) {
    return this.tablesService.update(id, dto);
  }

  @RequirePermissions("tables.manage")
  @Patch(":id/status")
  setStatus(@Req() req: any, @Param("id") id: string, @Body() dto: any) {
    return this.tablesService.setStatus(id, dto, `${req.user.firstName} ${req.user.lastName}`);
  }

  @RequirePermissions("tables.manage")
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.tablesService.remove(id);
  }
}