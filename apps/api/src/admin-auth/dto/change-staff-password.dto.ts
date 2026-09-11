import { IsString, MinLength } from "class-validator";

export class ChangeStaffPasswordDto {
  @IsString()
  currentPassword: string;

  @IsString()
  @MinLength(8)
  newPassword: string;
}