import { IsOptional, IsString } from "class-validator";

export class UpdateStaffProfileDto {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;
}