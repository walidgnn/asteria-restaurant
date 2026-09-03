import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateReservationDto } from "./dto/create-reservation.dto";

@Injectable()
export class ReservationsService {
  constructor(private prisma: PrismaService) {}

  async create(customerId: string, dto: CreateReservationDto) {
    const [hours, minutes] = dto.time.split(":").map(Number);
    const reservationDate = new Date(dto.date);
    reservationDate.setHours(hours, minutes, 0, 0);

    return this.prisma.reservation.create({
      data: {
        customer: { connect: { id: customerId } },
        partySize: dto.partySize,
        reservationDate,
        notes: dto.notes,
        status: "CONFIRMED",
        statusHistory: {
          create: { status: "CONFIRMED", note: "Reservation booked." },
        },
      },
    });
  }

  async findMine(customerId: string) {
    return this.prisma.reservation.findMany({
      where: { customerId },
      orderBy: { reservationDate: "desc" },
    });
  }

  async findOne(customerId: string, id: string) {
    const reservation = await this.prisma.reservation.findUnique({
      where: { id },
    });
    if (!reservation) throw new NotFoundException("Reservation not found.");
    if (reservation.customerId !== customerId) {
      throw new ForbiddenException("This reservation does not belong to you.");
    }
    return reservation;
  }

  async cancel(customerId: string, id: string) {
    await this.findOne(customerId, id); // ownership + existence check
    return this.prisma.reservation.update({
      where: { id },
      data: {
        status: "CANCELLED",
        statusHistory: {
          create: { status: "CANCELLED", note: "Cancelled by customer." },
        },
      },
    });
  }
}