import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { PrismaService } from "../prisma/prisma.service";
import { AdminLoginDto } from "./dto/admin-login.dto";

@Injectable()
export class AdminAuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService
  ) {}

  async login(dto: AdminLoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
      include: {
        roles: { include: { role: { include: { permissions: { include: { permission: true } } } } } },
      },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException("Invalid email or password.");
    }
    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid) {
      throw new UnauthorizedException("Invalid email or password.");
    }

    const permissions = new Set<string>();
    const roleNames: string[] = [];
    for (const ur of user.roles) {
      roleNames.push(ur.role.name);
      for (const rp of ur.role.permissions) {
        permissions.add(rp.permission.name);
      }
    }

    await this.prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
    const token = this.jwt.sign(
      { sub: user.id, email: user.email },
      { secret: process.env.ADMIN_JWT_SECRET, expiresIn: "12h" }
    );

    return {
      accessToken: token,
      staff: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        roles: roleNames,
        permissions: [...permissions],
      },
    };
  }
}