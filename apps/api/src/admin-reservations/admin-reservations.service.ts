import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import * as bcrypt from "bcrypt";
import * as crypto from "crypto";

const STATUS_FLOW: Record<string, string> = {
  PENDING: "CONFIRMED",
  CONFIRMED: "SEATED",
  SEATED: "COMPLETED",
};

@Injectable()
export class AdminReservationsService {
  constructor(private prisma: PrismaService) {}

  async findAll(filters: { date?: string; status?: string; search?: string }) {
    const targetDate = filters.date ? new Date(filters.date) : new Date();
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    const where: any = {
      reservationDate: { gte: startOfDay, lte: endOfDay },
    };
    if (filters.status) where.status = filters.status;
    if (filters.search) {
      const term = filters.search.trim();
      const words = term.split(/\s+/);

      where.customer = {
        OR: [
          { firstName: { contains: term, mode: "insensitive" } },
          { lastName: { contains: term, mode: "insensitive" } },
          ...(words.length > 1
            ? [
                {
                  AND: [
                    { firstName: { contains: words[0], mode: "insensitive" } },
                    { lastName: { contains: words.slice(1).join(" "), mode: "insensitive" } },
                  ],
                },
              ]
            : []),
        ],
      };
    }

    const reservations = await this.prisma.reservation.findMany({
      where,
      orderBy: { reservationDate: "asc" },
      include: { customer: true, table: true },
    });

    const allTables = await this.prisma.diningTable.count();
    const bookedTableIds = new Set(
      reservations.filter((r) => r.status !== "CANCELLED" && r.tableId).map((r) => r.tableId)
    );

    return {
      reservations,
      stats: {
        totalReservations: reservations.length,
        totalGuests: reservations.reduce((sum, r) => sum + r.partySize, 0),
        upcoming: reservations.filter((r) => new Date(r.reservationDate) > new Date() && r.status !== "CANCELLED").length,
        tablesAvailable: allTables - bookedTableIds.size,
      },
    };
  }

  async findOne(id: string) {
    const reservation = await this.prisma.reservation.findUnique({
      where: { id },
      include: {
        customer: true,
        table: true,
        statusHistory: { orderBy: { changedAt: "asc" } },
      },
    });
    if (!reservation) throw new NotFoundException("Reservation not found.");

    const previousCount = await this.prisma.reservation.count({
      where: { customerId: reservation.customerId, id: { not: id }, status: "COMPLETED" },
    });

    return { ...reservation, previousReservationsCount: previousCount };
  }

  async advanceStatus(id: string, staffName: string) {
    const reservation = await this.prisma.reservation.findUnique({ where: { id } });
    if (!reservation) throw new NotFoundException("Reservation not found.");

    const nextStatus = STATUS_FLOW[reservation.status];
    if (!nextStatus) throw new NotFoundException("This reservation cannot be advanced further.");

    return this.prisma.reservation.update({
      where: { id },
      data: {
        status: nextStatus as any,
        statusHistory: {
          create: { status: nextStatus as any, note: `Marked ${nextStatus.toLowerCase()} by ${staffName}.` },
        },
      },
    });
  }

  async markNoShow(id: string, staffName: string) {
    await this.findOne(id);
    return this.prisma.reservation.update({
      where: { id },
      data: {
        status: "NO_SHOW",
        statusHistory: { create: { status: "NO_SHOW", note: `Marked as no-show by ${staffName}.` } },
      },
    });
  }

  async cancel(id: string, staffName: string) {
    await this.findOne(id);
    return this.prisma.reservation.update({
      where: { id },
      data: {
        status: "CANCELLED",
        statusHistory: { create: { status: "CANCELLED", note: `Cancelled by ${staffName}.` } },
      },
    });
  }

  async updateStaffNotes(id: string, staffNotes: string) {
    await this.findOne(id);
    return this.prisma.reservation.update({ where: { id }, data: { staffNotes } });
  }

  async changeTable(id: string, tableId: string) {
    const reservation = await this.findOne(id);
    const table = await this.prisma.diningTable.findUnique({ where: { id: tableId } });
    if (!table) throw new NotFoundException("Table not found.");

    return this.prisma.reservation.update({
      where: { id },
      data: {
        table: { connect: { id: tableId } },
        statusHistory: {
          create: { status: reservation.status, note: `Reassigned to table ${table.number}.` },
        },
      },
    });
  }

  async getAvailableTables(reservationId: string) {
    const reservation = await this.findOne(reservationId);
    const sameSlot = await this.prisma.reservation.findMany({
      where: {
        id: { not: reservationId },
        reservationDate: reservation.reservationDate,
        status: { notIn: ["CANCELLED", "NO_SHOW"] },
      },
      select: { tableId: true },
    });
    const bookedIds = new Set(sameSlot.map((r) => r.tableId));
    return this.prisma.diningTable.findMany({
      where: { capacity: { gte: reservation.partySize }, id: { notIn: [...bookedIds].filter(Boolean) as string[] } },
      orderBy: { capacity: "asc" },
    });
  }

    async createManual(dto: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    date: string;
    time: string;
    partySize: number;
    notes?: string;
  }) {
    let customer = await this.prisma.customer.findUnique({ where: { email: dto.email } });
    if (!customer) {
      customer = await this.prisma.customer.create({
        data: {
          email: dto.email,
          firstName: dto.firstName,
          lastName: dto.lastName,
          phone: dto.phone,
          password: await bcrypt.hash(crypto.randomUUID(), 10), // no login access; placeholder
        },
      });
    }

    const [hours, minutes] = dto.time.split(":").map(Number);
    const reservationDate = new Date(dto.date);
    reservationDate.setHours(hours, minutes, 0, 0);

    const candidateTables = await this.prisma.diningTable.findMany({
      where: { capacity: { gte: dto.partySize } },
      orderBy: { capacity: "asc" },
    });
    const conflicting = await this.prisma.reservation.findMany({
      where: {
        reservationDate,
        status: { notIn: ["CANCELLED", "NO_SHOW"] },
        tableId: { in: candidateTables.map((t) => t.id) },
      },
      select: { tableId: true },
    });
    const bookedIds = new Set(conflicting.map((r) => r.tableId));
    const availableTable = candidateTables.find((t) => !bookedIds.has(t.id));

    return this.prisma.reservation.create({
      data: {
        customer: { connect: { id: customer.id } },
        table: availableTable ? { connect: { id: availableTable.id } } : undefined,
        partySize: dto.partySize,
        reservationDate,
        notes: dto.notes,
        status: "CONFIRMED",
        statusHistory: { create: { status: "CONFIRMED", note: "Created manually by staff." } },
      },
    });
  }

  async updateDetails(
    id: string,
    dto: { date: string; time: string; partySize: number },
    staffName: string
  ) {
    const reservation = await this.findOne(id);

    const [hours, minutes] = dto.time.split(":").map(Number);
    const reservationDate = new Date(dto.date);
    reservationDate.setHours(hours, minutes, 0, 0);

    const candidateTables = await this.prisma.diningTable.findMany({
      where: { capacity: { gte: dto.partySize } },
      orderBy: { capacity: "asc" },
    });
    if (candidateTables.length === 0) {
      throw new NotFoundException("No table can accommodate this party size.");
    }

    const conflicting = await this.prisma.reservation.findMany({
      where: {
        id: { not: id },
        reservationDate,
        status: { notIn: ["CANCELLED", "NO_SHOW"] },
        tableId: { in: candidateTables.map((t) => t.id) },
      },
      select: { tableId: true },
    });
    const bookedIds = new Set(conflicting.map((r) => r.tableId));

    // Prefer keeping the current table if it still fits and is free; otherwise find another.
    const currentStillWorks =
      reservation.table &&
      reservation.table.capacity >= dto.partySize &&
      !bookedIds.has(reservation.table.id);
    const chosenTable = currentStillWorks
      ? reservation.table
      : candidateTables.find((t) => !bookedIds.has(t.id));

    if (!chosenTable) {
      throw new NotFoundException("We're fully booked for that new time. Please choose a different slot.");
    }

    return this.prisma.reservation.update({
      where: { id },
      data: {
        partySize: dto.partySize,
        reservationDate,
        table: { connect: { id: chosenTable.id } },
        statusHistory: {
          create: { status: reservation.status, note: `Reservation details updated by ${staffName}.` },
        },
      },
      include: { table: true, customer: true },
    });
  }
}