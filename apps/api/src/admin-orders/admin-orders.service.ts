import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

const STATUS_FLOW: Record<string, string> = {
  PENDING: "CONFIRMED",
  CONFIRMED: "PREPARING",
  PREPARING: "READY",
  READY: "COMPLETED",
};

@Injectable()
export class AdminOrdersService {
  constructor(private prisma: PrismaService) {}

  async findAll(filters: { status?: string; orderType?: string; search?: string; page?: number }) {
    const page = filters.page ?? 1;
    const pageSize = 20;

    const where: any = {};
    if (filters.status) where.status = filters.status;
    if (filters.orderType) where.orderType = filters.orderType;
    if (filters.search) {
      const term = filters.search.trim();
      const words = term.split(/\s+/);

      where.OR = [
        { customer: { firstName: { contains: term, mode: "insensitive" } } },
        { customer: { lastName: { contains: term, mode: "insensitive" } } },
        { customer: { email: { contains: term, mode: "insensitive" } } },
        ...(words.length > 1
          ? [
              {
                AND: [
                  { customer: { firstName: { contains: words[0], mode: "insensitive" } } },
                  { customer: { lastName: { contains: words.slice(1).join(" "), mode: "insensitive" } } },
                ],
              },
            ]
          : []),
      ];
    }

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          customer: true,
          items: true,
          payment: true,
        },
      }),
      this.prisma.order.count({ where }),
    ]);

    return { orders, total, page, pageSize };
  }

  async findOne(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        customer: true,
        payment: true,
        statusHistory: { orderBy: { changedAt: "asc" } },
        items: {
          include: {
            dish: true,
            customizations: { include: { option: true } },
          },
        },
      },
    });
    if (!order) throw new NotFoundException("Order not found.");
    return order;
  }

  async advanceStatus(id: string, staffName: string) {
    const order = await this.prisma.order.findUnique({ where: { id } });
    if (!order) throw new NotFoundException("Order not found.");

    const nextStatus = STATUS_FLOW[order.status];
    if (!nextStatus) {
      throw new NotFoundException("This order cannot be advanced further.");
    }

    return this.prisma.order.update({
      where: { id },
      data: {
        status: nextStatus as any,
        statusHistory: {
          create: { status: nextStatus as any, note: `Marked ${nextStatus.toLowerCase()} by ${staffName}.` },
        },
      },
    });
  }

  async cancelOrder(id: string, staffName: string) {
    const order = await this.prisma.order.findUnique({ where: { id } });
    if (!order) throw new NotFoundException("Order not found.");

    return this.prisma.order.update({
      where: { id },
      data: {
        status: "CANCELLED",
        statusHistory: {
          create: { status: "CANCELLED", note: `Cancelled by ${staffName}.` },
        },
      },
    });
  }
}