import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { ReservationsService } from "./reservations.service";
import { CreateReservationDto } from "./dto/create-reservation.dto";
import { UpdateReservationDto } from "./dto/update-reservation.dto";

@UseGuards(JwtAuthGuard)
@Controller("reservations")
export class ReservationsController {
  constructor(private reservationsService: ReservationsService) {}

  @Post()
  create(@Req() req: any, @Body() dto: CreateReservationDto) {
    return this.reservationsService.create(req.user.id, dto);
  }

  @Get()
  findMine(@Req() req: any) {
    return this.reservationsService.findMine(req.user.id);
  }

  @Get(":id")
  findOne(@Req() req: any, @Param("id") id: string) {
    return this.reservationsService.findOne(req.user.id, id);
  }

  @Patch(":id/cancel")
  cancel(@Req() req: any, @Param("id") id: string) {
    return this.reservationsService.cancel(req.user.id, id);
  }

    @Patch(":id")
  update(@Req() req: any, @Param("id") id: string, @Body() dto: UpdateReservationDto) {
    return this.reservationsService.update(req.user.id, id, dto);
  }
}