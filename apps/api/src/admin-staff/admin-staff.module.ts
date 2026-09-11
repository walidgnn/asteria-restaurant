import { Module } from "@nestjs/common";
import { AdminStaffController } from "./admin-staff.controller";
import { AdminStaffService } from "./admin-staff.service";
import { AdminRolesService } from "./admin-roles.service";
import { AdminAuthModule } from "../admin-auth/admin-auth.module";

@Module({
  imports: [AdminAuthModule],
  controllers: [AdminStaffController],
  providers: [AdminStaffService, AdminRolesService],
})
export class AdminStaffModule {}