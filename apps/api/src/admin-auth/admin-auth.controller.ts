import { Body, Controller, Get, Patch, Post, Req, UseGuards } from "@nestjs/common";
import { AdminAuthService } from "./admin-auth.service";
import { AdminLoginDto } from "./dto/admin-login.dto";
import { AdminJwtAuthGuard } from "./admin-jwt-auth.guard";
import { UpdateStaffProfileDto } from "./dto/update-staff-profile.dto";
import { ChangeStaffPasswordDto } from "./dto/change-staff-password.dto";

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

  @UseGuards(AdminJwtAuthGuard)
  @Patch("me")
  updateProfile(@Req() req: any, @Body() dto: UpdateStaffProfileDto) {
    return this.adminAuthService.updateProfile(req.user.id, dto);
  }

  @UseGuards(AdminJwtAuthGuard)
  @Patch("me/password")
  changePassword(@Req() req: any, @Body() dto: ChangeStaffPasswordDto) {
    return this.adminAuthService.changePassword(req.user.id, dto);
  }
}