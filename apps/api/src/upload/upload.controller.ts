import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { extname } from "path";
import { AdminJwtAuthGuard } from "../admin-auth/admin-jwt-auth.guard";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

@UseGuards(AdminJwtAuthGuard)
@Controller("admin/upload")
export class UploadController {
  @Post("image")
  @UseInterceptors(
    FileInterceptor("file", {
      storage: diskStorage({
        destination: "./uploads",
        filename: (req, file, callback) => {
          const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extname(file.originalname)}`;
          callback(null, uniqueName);
        },
      }),
      limits: { fileSize: MAX_SIZE },
      fileFilter: (req, file, callback) => {
        if (!ALLOWED_TYPES.includes(file.mimetype)) {
          return callback(new BadRequestException("Only JPEG, PNG, WEBP, and GIF images are allowed."), false);
        }
        callback(null, true);
      },
    })
  )
  uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException("No file uploaded.");
    }
    return { url: `http://localhost:3001/uploads/${file.filename}` };
  }
}