import { ConflictException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import * as crypto from "crypto";
import { PrismaService } from "../prisma/prisma.service";
import { EmailService } from "../email/email.service";

@Injectable()
export class AdminStaffService {
  constructor(
    private prisma: PrismaService,
    private email: EmailService
  ) {}

  private assertManager(roles: string[]) {
    if (!roles.includes("Manager")) {
      throw new ForbiddenException("Only Managers can manage staff.");
    }
  }

  async findAll() {
    const users = await this.prisma.user.findMany({
      orderBy: { createdAt: "asc" },
      include: { roles: { include: { role: true } } },
    });
    return users.map((u) => ({
      id: u.id,
      firstName: u.firstName,
      lastName: u.lastName,
      email: u.email,
      status: u.status,
      lastLoginAt: u.lastLoginAt,
      role: u.roles[0]?.role.name ?? "No Role",
      roleId: u.roles[0]?.role.id ?? null,
    }));
  }

  async invite(
    dto: { firstName: string; lastName: string; email: string; roleId: string },
    actingRoles: string[]
  ) {
    this.assertManager(actingRoles);

    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) throw new ConflictException("A staff account with this email already exists.");

    const role = await this.prisma.role.findUnique({ where: { id: dto.roleId } });

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        firstName: dto.firstName,
        lastName: dto.lastName,
        password: await bcrypt.hash(crypto.randomUUID(), 10),
        status: "PENDING",
        invitedAt: new Date(),
      },
    });
    await this.prisma.userRole.create({ data: { userId: user.id, roleId: dto.roleId } });

    await this.email.send(
      dto.email,
      "You've been invited to join Asteria's team",
      `<p>Hi ${dto.firstName},</p>
       <p>You've been invited to join the Asteria staff team as <strong>${role?.name ?? "a team member"}</strong>.</p>
       <p>Please contact your manager to complete your account setup.</p>
       <p>— Asteria Management</p>`
    );

    return user;
  }

  async resendInvite(id: string, actingRoles: string[]) {
    this.assertManager(actingRoles);
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException("Staff member not found.");
    return this.prisma.user.update({ where: { id }, data: { invitedAt: new Date() } });
  }

  async updateRole(id: string, roleId: string, actingRoles: string[]) {
    this.assertManager(actingRoles);
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException("Staff member not found.");

    await this.prisma.userRole.deleteMany({ where: { userId: id } });
    await this.prisma.userRole.create({ data: { userId: id, roleId } });
    return { success: true };
  }

  async setActive(id: string, isActive: boolean, actingRoles: string[]) {
    this.assertManager(actingRoles);
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException("Staff member not found.");
    return this.prisma.user.update({
      where: { id },
      data: { isActive, status: isActive ? "ACTIVE" : "INACTIVE" },
    });
  }
}