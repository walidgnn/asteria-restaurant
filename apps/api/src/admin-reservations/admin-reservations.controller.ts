import { Body, Controller, Get, Param, Patch, Query, Req, UseGuards } from "@nestjs/common";
import { AdminJwtAuthGuard } from "../admin-auth/admin-jwt-auth.guard";
import { PermissionsGuard } from "../admin-auth/permissions.guard";
import { RequirePermissions } from "../admin-auth/permissions.decorator";
import { AdminReservationsService } from "./admin-reservations.service";

@UseGuards(AdminJwtAuthGuard, PermissionsGuard)
@Controller("admin/reservations")
export class AdminReservationsController {
  constructor(private reservationsService: AdminReservationsService) {}

  @RequirePermissions("reservations.view")
  @Get()
  findAll(
    @Query("date") date?: string,
    @Query("status") status?: string,
    @Query("search") search?: string
  ) {
    return this.reservationsService.findAll({ date, status, search });
  }

  @RequirePermissions("reservations.view")
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.reservationsService.findOne(id);
  }

  @RequirePermissions("reservations.view")
  @Get(":id/available-tables")
  getAvailableTables(@Param("id") id: string) {
    return this.reservationsService.getAvailableTables(id);
  }

  @RequirePermissions("reservations.manage")
  @Patch(":id/advance")
  advance(@Req() req: any, @Param("id") id: string) {
    return this.reservationsService.advanceStatus(id, `${req.user.firstName} ${req.user.lastName}`);
  }

  @RequirePermissions("reservations.manage")
  @Patch(":id/no-show")
  noShow(@Req() req: any, @Param("id") id: string) {
    return this.reservationsService.markNoShow(id, `${req.user.firstName} ${req.user.lastName}`);
  }

  @RequirePermissions("reservations.manage")
  @Patch(":id/cancel")
  cancel(@Req() req: any, @Param("id") id: string) {
    return this.reservationsService.cancel(id, `${req.user.firstName} ${req.user.lastName}`);
  }

  @RequirePermissions("reservations.manage")
  @Patch(":id/staff-notes")
  updateNotes(@Param("id") id: string, @Body() body: { staffNotes: string }) {
    return this.reservationsService.updateStaffNotes(id, body.staffNotes);
  }

  @RequirePermissions("reservations.manage")
  @Patch(":id/table")
  changeTable(@Param("id") id: string, @Body() body: { tableId: string }) {
    return this.reservationsService.changeTable(id, body.tableId);
  }
}