import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class AdminTablesService {
  constructor(private prisma: PrismaService) {}

  async findAll(status?: string) {
    const where = status ? { status: status as any } : {};
    const tables = await this.prisma.diningTable.findMany({
      where,
      orderBy: { number: "asc" },
      include: {
        reservations: {
          where: { status: { in: ["CONFIRMED", "PENDING"] } },
          orderBy: { reservationDate: "asc" },
          take: 1,
          include: { customer: true },
        },
      },
    });

    const allTables = await this.prisma.diningTable.count();
    const counts = await this.prisma.diningTable.groupBy({
      by: ["status"],
      _count: true,
    });
    const stats = {
      total: allTables,
      available: counts.find((c) => c.status === "AVAILABLE")?._count ?? 0,
      occupied: counts.find((c) => c.status === "OCCUPIED")?._count ?? 0,
      reserved: counts.find((c) => c.status === "RESERVED")?._count ?? 0,
      unavailable: counts.find((c) => c.status === "UNAVAILABLE")?._count ?? 0,
    };

    return { tables, stats };
  }

  async create(dto: { number: string; capacity: number }) {
    const existing = await this.prisma.diningTable.findFirst({ where: { number: dto.number } });
    if (existing) throw new ConflictException("A table with this number already exists.");
    return this.prisma.diningTable.create({ data: dto });
  }

  async update(id: string, dto: { number?: string; capacity?: number }) {
    const table = await this.prisma.diningTable.findUnique({ where: { id } });
    if (!table) throw new NotFoundException("Table not found.");
    return this.prisma.diningTable.update({ where: { id }, data: dto });
  }

  async setStatus(
    id: string,
    dto: { status: "AVAILABLE" | "OCCUPIED" | "RESERVED" | "UNAVAILABLE"; partySize?: number; reason?: string },
    staffName: string
  ) {
    const table = await this.prisma.diningTable.findUnique({ where: { id } });
    if (!table) throw new NotFoundException("Table not found.");

    const data: any = { status: dto.status };
    if (dto.status === "OCCUPIED") {
      data.currentPartySize = dto.partySize ?? null;
      data.seatedAt = new Date();
      data.unavailableReason = null;
    } else if (dto.status === "UNAVAILABLE") {
      data.unavailableReason = dto.reason ?? null;
      data.currentPartySize = null;
      data.seatedAt = null;
    } else {
      data.currentPartySize = null;
      data.seatedAt = null;
      data.unavailableReason = null;
    }

    return this.prisma.diningTable.update({
      where: { id },
      data: {
        ...data,
        statusHistory: {
          create: { status: dto.status, note: `Set to ${dto.status.toLowerCase()} by ${staffName}.` },
        },
      },
    });
  }

  async remove(id: string) {
    const reservationCount = await this.prisma.reservation.count({ where: { tableId: id } });
    if (reservationCount > 0) {
      throw new ConflictException(
        "This table has reservation history and cannot be deleted. Mark it unavailable instead."
      );
    }
    await this.prisma.tableStatusHistory.deleteMany({ where: { tableId: id } });
    return this.prisma.diningTable.delete({ where: { id } });
  }
}