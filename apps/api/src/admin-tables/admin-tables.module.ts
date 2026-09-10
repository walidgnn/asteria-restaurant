import { Module } from "@nestjs/common";
import { AdminTablesController } from "./admin-tables.controller";
import { AdminTablesService } from "./admin-tables.service";
import { AdminAuthModule } from "../admin-auth/admin-auth.module";

@Module({
  imports: [AdminAuthModule],
  controllers: [AdminTablesController],
  providers: [AdminTablesService],
})
export class AdminTablesModule {}