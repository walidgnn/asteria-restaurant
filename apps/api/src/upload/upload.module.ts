import { Module } from "@nestjs/common";
import { UploadController } from "./upload.controller";
import { AdminAuthModule } from "../admin-auth/admin-auth.module";

@Module({
  imports: [AdminAuthModule],
  controllers: [UploadController],
})
export class UploadModule {}