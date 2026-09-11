import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

@Injectable()
export class AdminRestaurantService {
  constructor(private prisma: PrismaService) {}

  private async getOrCreate() {
    let restaurant = await this.prisma.restaurant.findFirst();
    if (!restaurant) {
      restaurant = await this.prisma.restaurant.create({
        data: { name: "Asteria", address: "", city: "", phone: "", email: "" },
      });
      for (let day = 0; day < 7; day++) {
        await this.prisma.openingHour.create({
          data: { restaurantId: restaurant.id, dayOfWeek: day, openTime: "12:00", closeTime: "23:00", isClosed: day === 1 || day === 2 },
        });
      }
    }
    return restaurant;
  }

  async getInfo() {
    return this.getOrCreate();
  }

  async updateInfo(dto: any) {
    const restaurant = await this.getOrCreate();
    return this.prisma.restaurant.update({ where: { id: restaurant.id }, data: dto });
  }

  async getHours() {
    const restaurant = await this.getOrCreate();
    const hours = await this.prisma.openingHour.findMany({
      where: { restaurantId: restaurant.id },
      orderBy: { dayOfWeek: "asc" },
    });
    return hours.map((h) => ({ ...h, dayName: DAY_NAMES[h.dayOfWeek] }));
  }

  async updateHours(dto: { dayOfWeek: number; openTime: string; closeTime: string; isClosed: boolean }[]) {
    const restaurant = await this.getOrCreate();
    for (const day of dto) {
      const existing = await this.prisma.openingHour.findFirst({
        where: { restaurantId: restaurant.id, dayOfWeek: day.dayOfWeek },
      });
      if (existing) {
        await this.prisma.openingHour.update({
          where: { id: existing.id },
          data: { openTime: day.openTime, closeTime: day.closeTime, isClosed: day.isClosed },
        });
      } else {
        await this.prisma.openingHour.create({
          data: { restaurantId: restaurant.id, ...day },
        });
      }
    }
    return this.getHours();
  }

  async getGallery(section?: string) {
    const restaurant = await this.getOrCreate();
    const where: any = { restaurantId: restaurant.id };
    if (section && section !== "all") where.section = section;
    return this.prisma.galleryImage.findMany({ where, orderBy: { sortOrder: "asc" } });
  }

  async addImage(dto: { title?: string; url: string; altText?: string; section?: string }) {
    const restaurant = await this.getOrCreate();
    const maxSort = await this.prisma.galleryImage.aggregate({
      where: { restaurantId: restaurant.id },
      _max: { sortOrder: true },
    });
    return this.prisma.galleryImage.create({
      data: {
        restaurantId: restaurant.id,
        title: dto.title,
        url: dto.url,
        altText: dto.altText,
        section: dto.section ?? "gallery",
        sortOrder: (maxSort._max.sortOrder ?? -1) + 1,
      },
    });
  }

  async updateImage(id: string, dto: any) {
    return this.prisma.galleryImage.update({ where: { id }, data: dto });
  }

  async removeImage(id: string) {
    return this.prisma.galleryImage.delete({ where: { id } });
  }
}