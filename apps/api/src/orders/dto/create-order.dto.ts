import { Type } from "class-transformer";
import { IsArray, IsIn, IsInt, IsOptional, IsString, Min, ValidateNested } from "class-validator";

class OrderItemInput {
  @IsString()
  dishId: string;

  @IsInt()
  @Min(1)
  quantity: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  optionIds?: string[];
}

export class CreateOrderDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemInput)
  items: OrderItemInput[];

  @IsIn(["pickup", "delivery"])
  orderType: "pickup" | "delivery";

  @IsOptional()
  @IsString()
  notes?: string;
}