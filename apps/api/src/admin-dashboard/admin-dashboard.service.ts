import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class AdminDashboardService {
  constructor(private prisma: PrismaService) {}

  async getSummary() {
    const now = new Date();
    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);

    const [todaysOrders, activeOrders, todaysReservations, upcomingReservations, tables, occupiedTables, reservedTables] =
      await Promise.all([
        this.prisma.order.findMany({
          where: { createdAt: { gte: startOfDay, lte: endOfDay } },
        }),
        this.prisma.order.findMany({
          where: {
            createdAt: { gte: startOfDay, lte: endOfDay },
            status: { in: ["PENDING", "CONFIRMED", "PREPARING", "READY"] },
          },
          orderBy: { createdAt: "desc" },
          take: 5,
        }),
        this.prisma.reservation.findMany({
          where: { reservationDate: { gte: startOfDay, lte: endOfDay } },
        }),
        this.prisma.reservation.findMany({
          where: {
            reservationDate: { gte: now, lte: endOfDay },
            status: { notIn: ["CANCELLED", "NO_SHOW"] },
          },
          orderBy: { reservationDate: "asc" },
          take: 5,
          include: { customer: true },
        }),
        this.prisma.diningTable.count(),
        this.prisma.diningTable.count({ where: { status: "OCCUPIED" } }),
        this.prisma.diningTable.count({ where: { status: "RESERVED" } }),
      ]);

    const revenueToday = todaysOrders
      .filter((o) => o.status !== "CANCELLED")
      .reduce((sum, o) => sum + Number(o.totalAmount), 0);

    const recentOrderActivity = await this.prisma.orderStatusHistory.findMany({
      orderBy: { changedAt: "desc" },
      take: 3,
      include: { order: true },
    });
    const recentReservationActivity = await this.prisma.reservationStatusHistory.findMany({
      orderBy: { changedAt: "desc" },
      take: 3,
      include: { reservation: true },
    });

    const recentActivity = [
      ...recentOrderActivity.map((h) => ({
        time: h.changedAt,
        message: `Order #A${h.order.orderNumber} ${h.note ?? h.status.toLowerCase()}`,
      })),
      ...recentReservationActivity.map((h) => ({
        time: h.changedAt,
        message: `Reservation ${h.note ?? h.status.toLowerCase()}`,
      })),
    ]
      .sort((a, b) => +new Date(b.time) - +new Date(a.time))
      .slice(0, 5);

    return {
      todaysOrdersCount: todaysOrders.length,
      activeOrdersCount: activeOrders.length,
      todaysReservationsCount: todaysReservations.length,
      upcomingReservationsCount: upcomingReservations.length,
      revenueToday,
      activeOrders,
      upcomingReservations,
      tableStatus: {
        total: tables,
        occupied: occupiedTables,
        reserved: reservedTables,
        available: tables - occupiedTables - reservedTables,
      },
      recentActivity,
    };
  }
}