import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class AdminCustomizationsService {
  constructor(private prisma: PrismaService) {}

  async findAll(search?: string) {
    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" as const } },
            { options: { some: { name: { contains: search, mode: "insensitive" as const } } } },
          ],
        }
      : {};

    return this.prisma.customizationGroup.findMany({
      where,
      include: {
        options: { orderBy: { sortOrder: "asc" } },
        dishes: true,
      },
    });
  }

  async create(dto: { name: string; isRequired?: boolean; allowMultiple?: boolean; maxSelections?: number }) {
    return this.prisma.customizationGroup.create({
      data: {
        name: dto.name,
        isRequired: dto.isRequired ?? false,
        allowMultiple: dto.allowMultiple ?? false,
        maxSelections: dto.maxSelections,
      },
    });
  }

  async update(id: string, dto: any) {
    const group = await this.prisma.customizationGroup.findUnique({ where: { id } });
    if (!group) throw new NotFoundException("Customization group not found.");
    return this.prisma.customizationGroup.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    const usageCount = await this.prisma.dishCustomizationGroup.count({ where: { groupId: id } });
    if (usageCount > 0) {
      throw new ConflictException(`This group is used by ${usageCount} dish(es). Remove it from those dishes first.`);
    }
    await this.prisma.customizationOption.deleteMany({ where: { groupId: id } });
    return this.prisma.customizationGroup.delete({ where: { id } });
  }

  async addOption(groupId: string, dto: { name: string; priceModifier: number }) {
    const maxSort = await this.prisma.customizationOption.aggregate({
      where: { groupId },
      _max: { sortOrder: true },
    });
    return this.prisma.customizationOption.create({
      data: {
        groupId,
        name: dto.name,
        priceModifier: dto.priceModifier,
        sortOrder: (maxSort._max.sortOrder ?? -1) + 1,
      },
    });
  }

  async updateOption(optionId: string, dto: { name?: string; priceModifier?: number; isAvailable?: boolean }) {
    return this.prisma.customizationOption.update({ where: { id: optionId }, data: dto });
  }

  async removeOption(optionId: string) {
    const usageCount = await this.prisma.orderItemCustomization.count({ where: { optionId } });
    if (usageCount > 0) {
      throw new ConflictException("This option has order history and cannot be deleted. Mark it unavailable instead.");
    }
    return this.prisma.customizationOption.delete({ where: { id: optionId } });
  }
}