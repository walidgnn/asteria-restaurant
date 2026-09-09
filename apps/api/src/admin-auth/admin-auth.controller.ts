import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { AdminAuthService } from "./admin-auth.service";
import { AdminLoginDto } from "./dto/admin-login.dto";
import { AdminJwtAuthGuard } from "./admin-jwt-auth.guard";

@Controller("admin/auth")
export class AdminAuthController {
  constructor(private adminAuthService: AdminAuthService) {}

  @Post("login")
  login(@Body() dto: AdminLoginDto) {
    return this.adminAuthService.login(dto);
  }

  @UseGuards(AdminJwtAuthGuard)
  @Get("me")
  me(@Req() req: any) {
    return req.user;
  }
}