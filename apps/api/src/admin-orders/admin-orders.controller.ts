import { Controller, Get, Param, Patch, Query, Req, UseGuards } from "@nestjs/common";
import { AdminJwtAuthGuard } from "../admin-auth/admin-jwt-auth.guard";
import { PermissionsGuard } from "../admin-auth/permissions.guard";
import { RequirePermissions } from "../admin-auth/permissions.decorator";
import { AdminOrdersService } from "./admin-orders.service";

@UseGuards(AdminJwtAuthGuard, PermissionsGuard)
@Controller("admin/orders")
export class AdminOrdersController {
  constructor(private ordersService: AdminOrdersService) {}

  @RequirePermissions("orders.view")
  @Get()
  findAll(
    @Query("status") status?: string,
    @Query("orderType") orderType?: string,
    @Query("search") search?: string,
    @Query("page") page?: string
  ) {
    return this.ordersService.findAll({
      status,
      orderType,
      search,
      page: page ? parseInt(page) : 1,
    });
  }

  @RequirePermissions("orders.view")
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.ordersService.findOne(id);
  }

  @RequirePermissions("orders.manage")
  @Patch(":id/advance")
  advance(@Req() req: any, @Param("id") id: string) {
    return this.ordersService.advanceStatus(id, `${req.user.firstName} ${req.user.lastName}`);
  }

  @RequirePermissions("orders.manage")
  @Patch(":id/cancel")
  cancel(@Req() req: any, @Param("id") id: string) {
    return this.ordersService.cancelOrder(id, `${req.user.firstName} ${req.user.lastName}`);
  }
}