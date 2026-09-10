import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class AdminDishesService {
  constructor(private prisma: PrismaService) {}

  async findAll(filters: { categoryId?: string; isAvailable?: string; isFeatured?: string; search?: string }) {
    const where: any = {};
    if (filters.categoryId) where.categoryId = filters.categoryId;
    if (filters.isAvailable) where.isAvailable = filters.isAvailable === "true";
    if (filters.isFeatured) where.isFeatured = filters.isFeatured === "true";
    if (filters.search) where.name = { contains: filters.search, mode: "insensitive" };

    return this.prisma.dish.findMany({
      where,
      orderBy: [{ categoryId: "asc" }, { sortOrder: "asc" }],
      include: {
        category: true,
        images: { orderBy: { sortOrder: "asc" }, take: 1 },
        customizationGroups: true,
      },
    });
  }

  async findOne(id: string) {
    const dish = await this.prisma.dish.findUnique({
      where: { id },
      include: {
        images: { orderBy: { sortOrder: "asc" } },
        customizationGroups: { include: { group: true } },
      },
    });
    if (!dish) throw new NotFoundException("Dish not found.");
    return dish;
  }

  async create(dto: {
    name: string;
    description?: string;
    price: number;
    categoryId: string;
    imageUrl?: string;
    isAvailable?: boolean;
    isFeatured?: boolean;
    customizationGroupIds?: string[];
  }) {
    const dish = await this.prisma.dish.create({
      data: {
        name: dto.name,
        description: dto.description,
        price: dto.price,
        categoryId: dto.categoryId,
        isAvailable: dto.isAvailable ?? true,
        isFeatured: dto.isFeatured ?? false,
      },
    });

    if (dto.imageUrl) {
      await this.prisma.dishImage.create({
        data: { dishId: dish.id, url: dto.imageUrl, sortOrder: 0 },
      });
    }
    if (dto.customizationGroupIds?.length) {
      await this.prisma.dishCustomizationGroup.createMany({
        data: dto.customizationGroupIds.map((groupId) => ({ dishId: dish.id, groupId })),
      });
    }

    return this.findOne(dish.id);
  }

  async update(
    id: string,
    dto: {
      name?: string;
      description?: string;
      price?: number;
      categoryId?: string;
      imageUrl?: string;
      isAvailable?: boolean;
      isFeatured?: boolean;
      customizationGroupIds?: string[];
    }
  ) {
    const existing = await this.prisma.dish.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException("Dish not found.");

    await this.prisma.dish.update({
      where: { id },
      data: {
        name: dto.name,
        description: dto.description,
        price: dto.price,
        categoryId: dto.categoryId,
        isAvailable: dto.isAvailable,
        isFeatured: dto.isFeatured,
      },
    });

    if (dto.imageUrl !== undefined) {
      const existingImage = await this.prisma.dishImage.findFirst({ where: { dishId: id } });
      if (existingImage) {
        await this.prisma.dishImage.update({ where: { id: existingImage.id }, data: { url: dto.imageUrl } });
      } else if (dto.imageUrl) {
        await this.prisma.dishImage.create({ data: { dishId: id, url: dto.imageUrl, sortOrder: 0 } });
      }
    }

    if (dto.customizationGroupIds !== undefined) {
      await this.prisma.dishCustomizationGroup.deleteMany({ where: { dishId: id } });
      if (dto.customizationGroupIds.length) {
        await this.prisma.dishCustomizationGroup.createMany({
          data: dto.customizationGroupIds.map((groupId) => ({ dishId: id, groupId })),
        });
      }
    }

    return this.findOne(id);
  }

  async remove(id: string) {
    const orderItemCount = await this.prisma.orderItem.count({ where: { dishId: id } });
    if (orderItemCount > 0) {
      throw new ConflictException(
        "This dish has order history and cannot be deleted. Mark it unavailable instead."
      );
    }
    await this.prisma.dishImage.deleteMany({ where: { dishId: id } });
    await this.prisma.dishCustomizationGroup.deleteMany({ where: { dishId: id } });
    return this.prisma.dish.delete({ where: { id } });
  }
}