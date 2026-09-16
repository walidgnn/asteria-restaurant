import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateOrderDto } from "./dto/create-order.dto";
import { EmailService } from "../email/email.service";

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private email: EmailService
  ) {}

    async createOrder(customerId: string, dto: CreateOrderDto) {
    if (dto.items.length === 0) {
      throw new BadRequestException("Cannot place an order with no items.");
    }

    const uniqueDishIds = [...new Set(dto.items.map((i) => i.dishId))];
    const dishes = await this.prisma.dish.findMany({
      where: { id: { in: uniqueDishIds }, isAvailable: true },
    });
    if (dishes.length !== uniqueDishIds.length) {
      throw new BadRequestException("One or more dishes are unavailable.");
    }
    const dishMap = new Map(dishes.map((d) => [d.id, d]));

    const allOptionIds = dto.items.flatMap((i) => i.optionIds ?? []);
    const options = allOptionIds.length
      ? await this.prisma.customizationOption.findMany({
          where: { id: { in: allOptionIds } },
        })
      : [];
    const optionMap = new Map(options.map((o) => [o.id, o]));

    let totalAmount = 0;
    const itemsData = dto.items.map((item) => {
      const dish = dishMap.get(item.dishId)!;
      const unitPrice = Number(dish.price);
      const selectedOptions = (item.optionIds ?? []).map((id) => optionMap.get(id)!);
      const modifiersTotal = selectedOptions.reduce((s, o) => s + Number(o.priceModifier), 0);
      totalAmount += (unitPrice + modifiersTotal) * item.quantity;

      return {
        dishId: item.dishId,
        quantity: item.quantity,
        unitPrice,
        customizations: {
          create: selectedOptions.map((o) => ({
            optionId: o.id,
            priceModifier: o.priceModifier,
          })),
        },
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
        customer: true,
      },
    });

    return order;
  }

    async getMyOrders(customerId: string) {
    return this.prisma.order.findMany({
      where: { customerId },
      orderBy: { createdAt: "desc" },
      include: {
        items: {
          include: {
            dish: true,
            customizations: { include: { option: true } },
          },
        },
      },
    });
  }

    async getOrderById(customerId: string, orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            dish: true,
            customizations: { include: { option: true } },
          },
        },
      },
    });

    if (!order) throw new NotFoundException("Order not found.");
    if (order.customerId !== customerId) {
      throw new ForbiddenException("This order does not belong to you.");
    }

    return order;
  }
}