import { IsDateString, IsInt, IsOptional, IsString, Min } from "class-validator";

export class UpdateReservationDto {
  @IsDateString()
  date: string;

  @IsString()
  time: string;

  @IsInt()
  @Min(1)
  partySize: number;

  @IsOptional()
  @IsString()
  notes?: string;
}