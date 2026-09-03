import { IsDateString, IsInt, IsOptional, IsString, Min } from "class-validator";

export class CreateReservationDto {
  @IsDateString()
  date: string; // "2026-08-30"

  @IsString()
  time: string; // "19:30"

  @IsInt()
  @Min(1)
  partySize: number;

  @IsOptional()
  @IsString()
  notes?: string;
}