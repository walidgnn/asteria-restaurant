import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from "@nestjs/common";
import { AdminJwtAuthGuard } from "../admin-auth/admin-jwt-auth.guard";
import { PermissionsGuard } from "../admin-auth/permissions.guard";
import { RequirePermissions } from "../admin-auth/permissions.decorator";
import { AdminStaffService } from "./admin-staff.service";
import { AdminRolesService } from "./admin-roles.service";

@UseGuards(AdminJwtAuthGuard, PermissionsGuard)
@Controller("admin/staff")
export class AdminStaffController {
  constructor(
    private staffService: AdminStaffService,
    private rolesService: AdminRolesService
  ) {}

  @RequirePermissions("staff.view")
  @Get()
  findAll() {
    return this.staffService.findAll();
  }

  @RequirePermissions("staff.view")
  @Post("invite")
  invite(@Req() req: any, @Body() dto: any) {
    return this.staffService.invite(dto, req.user.roles);
  }

  @RequirePermissions("staff.view")
  @Patch(":id/resend")
  resend(@Req() req: any, @Param("id") id: string) {
    return this.staffService.resendInvite(id, req.user.roles);
  }

  @RequirePermissions("staff.view")
  @Patch(":id/role")
  updateRole(@Req() req: any, @Param("id") id: string, @Body() body: { roleId: string }) {
    return this.staffService.updateRole(id, body.roleId, req.user.roles);
  }

  @RequirePermissions("staff.view")
  @Patch(":id/active")
  setActive(@Req() req: any, @Param("id") id: string, @Body() body: { isActive: boolean }) {
    return this.staffService.setActive(id, body.isActive, req.user.roles);
  }

  @RequirePermissions("staff.view")
  @Get("roles")
  findRoles() {
    return this.rolesService.findAll();
  }

  @RequirePermissions("staff.view")
  @Get("permissions")
  findPermissions() {
    return this.rolesService.findAllPermissions();
  }

  @RequirePermissions("staff.view")
  @Patch("roles/:roleId/permissions")
  updateRolePermissions(@Req() req: any, @Param("roleId") roleId: string, @Body() body: { permissionIds: string[] }) {
    return this.rolesService.updateRolePermissions(roleId, body.permissionIds, req.user.roles);
  }
}