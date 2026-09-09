import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

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
      where.customer = {
        OR: [
          { firstName: { contains: filters.search, mode: "insensitive" } },
          { lastName: { contains: filters.search, mode: "insensitive" } },
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
}