import { ConflictException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateReservationDto } from "./dto/create-reservation.dto";

@Injectable()
export class ReservationsService {
  constructor(private prisma: PrismaService) {}

  async create(customerId: string, dto: CreateReservationDto) {
    const [hours, minutes] = dto.time.split(":").map(Number);
    const reservationDate = new Date(dto.date);
    reservationDate.setHours(hours, minutes, 0, 0);

    // Find tables big enough for this party, smallest-fit first (efficient allocation)
    const candidateTables = await this.prisma.diningTable.findMany({
      where: { capacity: { gte: dto.partySize } },
      orderBy: { capacity: "asc" },
    });

    if (candidateTables.length === 0) {
      throw new ConflictException(
        "No table can accommodate this party size. Please contact us directly for large parties."
      );
    }

    // Find which of those tables already have an active reservation at this exact date/time
    const conflicting = await this.prisma.reservation.findMany({
      where: {
        reservationDate,
        status: { notIn: ["CANCELLED", "NO_SHOW"] },
        tableId: { in: candidateTables.map((t) => t.id) },
      },
      select: { tableId: true },
    });
    const bookedTableIds = new Set(conflicting.map((r) => r.tableId));

    const availableTable = candidateTables.find((t) => !bookedTableIds.has(t.id));

    if (!availableTable) {
      throw new ConflictException(
        "We're fully booked for that time. Please choose a different time or date."
      );
    }

    return this.prisma.reservation.create({
      data: {
        customer: { connect: { id: customerId } },
        table: { connect: { id: availableTable.id } },
        partySize: dto.partySize,
        reservationDate,
        notes: dto.notes,
        status: "CONFIRMED",
        statusHistory: {
          create: { status: "CONFIRMED", note: "Reservation booked." },
        },
      },
      include: { table: true },
    });
  }

  async findMine(customerId: string) {
    return this.prisma.reservation.findMany({
      where: { customerId },
      orderBy: { reservationDate: "desc" },
      include: { table: true },
    });
  }

  async findOne(customerId: string, id: string) {
    const reservation = await this.prisma.reservation.findUnique({
      where: { id },
      include: { table: true },
    });
    if (!reservation) throw new NotFoundException("Reservation not found.");
    if (reservation.customerId !== customerId) {
      throw new ForbiddenException("This reservation does not belong to you.");
    }
    return reservation;
  }

  async cancel(customerId: string, id: string) {
    await this.findOne(customerId, id);
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