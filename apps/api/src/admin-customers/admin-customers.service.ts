import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class AdminCustomersService {
  constructor(private prisma: PrismaService) {}

  async findAll(filters: { search?: string; page?: number }) {
    const page = filters.page ?? 1;
    const pageSize = 20;

    const where: any = { deletedAt: null };
    if (filters.search) {
      const term = filters.search.trim();
      const words = term.split(/\s+/);
      where.OR = [
        { firstName: { contains: term, mode: "insensitive" } },
        { lastName: { contains: term, mode: "insensitive" } },
        { email: { contains: term, mode: "insensitive" } },
        { phone: { contains: term, mode: "insensitive" } },
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
      ];
    }

    const [customers, total] = await Promise.all([
      this.prisma.customer.findMany({
        where,
        orderBy: { updatedAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          _count: { select: { orders: true, reservations: true } },
        },
      }),
      this.prisma.customer.count({ where }),
    ]);

    // "Last activity" = most recent order or reservation date
    const withActivity = await Promise.all(
      customers.map(async (c) => {
        const [lastOrder, lastReservation] = await Promise.all([
          this.prisma.order.findFirst({ where: { customerId: c.id }, orderBy: { createdAt: "desc" } }),
          this.prisma.reservation.findFirst({ where: { customerId: c.id }, orderBy: { reservationDate: "desc" } }),
        ]);
        const dates = [lastOrder?.createdAt, lastReservation?.reservationDate].filter(Boolean) as Date[];
        const lastActivity = dates.length ? new Date(Math.max(...dates.map((d) => +d))) : null;
        return { ...c, lastActivity };
      })
    );

    return { customers: withActivity, total, page, pageSize };
  }

  async findOne(id: string) {
    const customer = await this.prisma.customer.findUnique({
      where: { id },
      include: {
        orders: { orderBy: { createdAt: "desc" }, take: 10 },
        reservations: { orderBy: { reservationDate: "desc" }, take: 10, include: { table: true } },
      },
    });
    if (!customer) throw new NotFoundException("Customer not found.");

    const [orderCount, reservationCount] = await Promise.all([
      this.prisma.order.count({ where: { customerId: id } }),
      this.prisma.reservation.count({ where: { customerId: id } }),
    ]);

    const recentOrderActivity = await this.prisma.orderStatusHistory.findMany({
      where: { order: { customerId: id } },
      orderBy: { changedAt: "desc" },
      take: 3,
      include: { order: true },
    });
    const recentReservationActivity = await this.prisma.reservationStatusHistory.findMany({
      where: { reservation: { customerId: id } },
      orderBy: { changedAt: "desc" },
      take: 3,
      include: { reservation: true },
    });
    const recentActivity = [
      ...recentOrderActivity.map((h) => ({ time: h.changedAt, message: `Order #A${h.order.orderNumber} ${h.note ?? h.status.toLowerCase()}` })),
      ...recentReservationActivity.map((h) => ({ time: h.changedAt, message: `Reservation ${h.note ?? h.status.toLowerCase()}` })),
    ].sort((a, b) => +new Date(b.time) - +new Date(a.time)).slice(0, 5);

    return { ...customer, orderCount, reservationCount, recentActivity };
  }

  async updateNotes(id: string, staffNotes: string) {
    const customer = await this.prisma.customer.findUnique({ where: { id } });
    if (!customer) throw new NotFoundException("Customer not found.");
    return this.prisma.customer.update({ where: { id }, data: { staffNotes } });
  }

  async toggleVip(id: string) {
    const customer = await this.prisma.customer.findUnique({ where: { id } });
    if (!customer) throw new NotFoundException("Customer not found.");
    return this.prisma.customer.update({ where: { id }, data: { isVip: !customer.isVip } });
  }

  async update(id: string, dto: { firstName?: string; lastName?: string; phone?: string }) {
    const customer = await this.prisma.customer.findUnique({ where: { id } });
    if (!customer) throw new NotFoundException("Customer not found.");
    return this.prisma.customer.update({ where: { id }, data: dto });
  }
}