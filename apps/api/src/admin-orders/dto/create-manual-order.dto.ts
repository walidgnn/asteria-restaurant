import { Type } from "class-transformer";
import { IsArray, IsEmail, IsIn, IsInt, IsOptional, IsString, Min, ValidateNested } from "class-validator";

class ManualOrderItem {
  @IsString()
  dishId: string;

  @IsInt()
  @Min(1)
  quantity: number;
}

export class CreateManualOrderDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ManualOrderItem)
  items: ManualOrderItem[];

  @IsIn(["pickup", "delivery"])
  orderType: "pickup" | "delivery";

  @IsOptional()
  @IsString()
  notes?: string;
}