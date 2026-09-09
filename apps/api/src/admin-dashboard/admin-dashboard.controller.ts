import { Controller, Get, UseGuards } from "@nestjs/common";
import { AdminJwtAuthGuard } from "../admin-auth/admin-jwt-auth.guard";
import { PermissionsGuard } from "../admin-auth/permissions.guard";
import { RequirePermissions } from "../admin-auth/permissions.decorator";
import { AdminDashboardService } from "./admin-dashboard.service";

@UseGuards(AdminJwtAuthGuard, PermissionsGuard)
@Controller("admin/dashboard")
export class AdminDashboardController {
  constructor(private dashboardService: AdminDashboardService) {}

  @RequirePermissions("dashboard.view")
  @Get()
  getSummary() {
    return this.dashboardService.getSummary();
  }
}