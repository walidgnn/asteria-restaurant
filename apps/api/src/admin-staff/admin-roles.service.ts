import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class AdminRolesService {
  constructor(private prisma: PrismaService) {}

  private assertManager(roles: string[]) {
    if (!roles.includes("Manager")) {
      throw new ForbiddenException("Only Managers can edit roles and permissions.");
    }
  }

  async findAll() {
    return this.prisma.role.findMany({
      include: { permissions: { include: { permission: true } } },
    });
  }

  async findAllPermissions() {
    return this.prisma.permission.findMany({ orderBy: { name: "asc" } });
  }

  async updateRolePermissions(roleId: string, permissionIds: string[], actingRoles: string[]) {
    this.assertManager(actingRoles);
    const role = await this.prisma.role.findUnique({ where: { id: roleId } });
    if (!role) throw new NotFoundException("Role not found.");

    await this.prisma.rolePermission.deleteMany({ where: { roleId } });
    if (permissionIds.length) {
      await this.prisma.rolePermission.createMany({
        data: permissionIds.map((permissionId) => ({ roleId, permissionId })),
      });
    }
    return { success: true };
  }
}