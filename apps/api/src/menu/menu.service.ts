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
}