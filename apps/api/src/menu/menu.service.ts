import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class MenuService {
  constructor(private prisma: PrismaService) {}

  async getFullMenu() {
    return this.prisma.menuCategory.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
      include: {
        dishes: {
          where: { isAvailable: true },
          orderBy: { sortOrder: "asc" },
        },
      },
    });
  }

    async getDishById(id: string) {
    return this.prisma.dish.findUnique({
      where: { id },
      include: {
        category: true,
        images: { orderBy: { sortOrder: "asc" } },
        customizationGroups: {
          include: {
            group: {
              include: {
                options: { orderBy: { sortOrder: "asc" } },
              },
            },
          },
        },
      },
    });
  }
}