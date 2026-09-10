import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class AdminCategoriesService {
  constructor(private prisma: PrismaService) {}

  async findAll(search?: string) {
    const where = search
      ? { name: { contains: search, mode: "insensitive" as const } }
      : {};

    const categories = await this.prisma.menuCategory.findMany({
      where,
      orderBy: { sortOrder: "asc" },
      include: { _count: { select: { dishes: true } } },
    });
    return categories;
  }

  async create(dto: { name: string; description?: string }) {
    const existing = await this.prisma.menuCategory.findUnique({ where: { name: dto.name } });
    if (existing) throw new ConflictException("A category with this name already exists.");

    const maxSort = await this.prisma.menuCategory.aggregate({ _max: { sortOrder: true } });
    return this.prisma.menuCategory.create({
      data: {
        name: dto.name,
        description: dto.description,
        sortOrder: (maxSort._max.sortOrder ?? -1) + 1,
      },
    });
  }

  async update(id: string, dto: { name?: string; description?: string; isActive?: boolean; sortOrder?: number }) {
    const category = await this.prisma.menuCategory.findUnique({ where: { id } });
    if (!category) throw new NotFoundException("Category not found.");
    return this.prisma.menuCategory.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    const dishCount = await this.prisma.dish.count({ where: { categoryId: id } });
    if (dishCount > 0) {
      throw new ConflictException(
        `This category has ${dishCount} dish(es). Move or delete them before removing the category.`
      );
    }
    return this.prisma.menuCategory.delete({ where: { id } });
  }
}