import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateOrderDto } from "./dto/create-order.dto";

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async createOrder(customerId: string, dto: CreateOrderDto) {
    if (dto.items.length === 0) {
      throw new BadRequestException("Cannot place an order with no items.");
    }

    const dishIds = dto.items.map((i) => i.dishId);
    const dishes = await this.prisma.dish.findMany({
      where: { id: { in: dishIds }, isAvailable: true },
    });

    if (dishes.length !== dishIds.length) {
      throw new BadRequestException("One or more dishes are unavailable.");
    }

    const dishMap = new Map(dishes.map((d) => [d.id, d]));
    let totalAmount = 0;
    const itemsData = dto.items.map((item) => {
      const dish = dishMap.get(item.dishId)!;
      const unitPrice = Number(dish.price);
      totalAmount += unitPrice * item.quantity;
      return {
        dishId: item.dishId,
        quantity: item.quantity,
        unitPrice,
      };
    });

    const order = await this.prisma.order.create({
      data: {
        customer: { connect: { id: customerId } },
        orderType: dto.orderType,
        notes: dto.notes,
        totalAmount,
        items: { create: itemsData },
        statusHistory: {
          create: { status: "PENDING", note: "Order placed." },
        },
      },
      include: {
        items: { include: { dish: true } },
      },
    });

    return order;
  }

  async getMyOrders(customerId: string) {
    return this.prisma.order.findMany({
      where: { customerId },
      orderBy: { createdAt: "desc" },
      include: { items: { include: { dish: true } } },
    });
  }

  async getOrderById(customerId: string, orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { items: { include: { dish: true } } },
    });

    if (!order) throw new NotFoundException("Order not found.");
    if (order.customerId !== customerId) {
      throw new ForbiddenException("This order does not belong to you.");
    }

    return order;
  }
}