import { Body, Controller, Delete, Get, Patch, Post, Req, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { JwtAuthGuard } from "./jwt-auth.guard";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { ChangePasswordDto } from "./dto/change-password.dto";
import { Throttle } from "@nestjs/throttler";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}
  
  @Post("verify-email")
  verifyEmail(@Body() body: { token: string }) {
    return this.authService.verifyEmail(body.token);
  }

  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post("register")
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post("login")
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get("me")
  me(@Req() req: any) {
    return req.user;
  }
  
  @UseGuards(JwtAuthGuard)
  @Patch("me")
  updateProfile(@Req() req: any, @Body() dto: UpdateProfileDto) {
    return this.authService.updateProfile(req.user.id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch("me/password")
  changePassword(@Req() req: any, @Body() dto: ChangePasswordDto) {
    return this.authService.changePassword(req.user.id, dto);
  }

    @UseGuards(JwtAuthGuard)
    @Delete("me")
  deleteAccount(@Req() req: any) {
    return this.authService.deleteAccount(req.user.id);
  }

  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post("forgot-password")
  requestReset(@Body() body: { email: string }) {
    return this.authService.requestPasswordReset(body.email);
  }

  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post("reset-password")
  resetPassword(@Body() body: { token: string; newPassword: string }) {
    return this.authService.resetPassword(body.token, body.newPassword);
  }
}