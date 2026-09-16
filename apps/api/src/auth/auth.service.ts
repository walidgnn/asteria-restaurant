import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { PrismaService } from "../prisma/prisma.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import * as crypto from "crypto";
import { EmailService } from "../email/email.service";

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private email: EmailService
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.prisma.customer.findUnique({
      where: { email: dto.email },
    });
    if (existing) {
      throw new ConflictException("An account with this email already exists.");
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const customer = await this.prisma.customer.create({
      data: {
        firstName: dto.firstName,
        lastName: dto.lastName,
        email: dto.email,
        password: hashedPassword,
      },
    });

    return this.signToken(customer.id, customer.email, customer.firstName, customer.lastName);
  }

  async login(dto: LoginDto) {
    const customer = await this.prisma.customer.findUnique({
      where: { email: dto.email },
    });
    if (!customer || customer.deletedAt) {
      throw new UnauthorizedException("Invalid email or password.");
    }

    const passwordValid = await bcrypt.compare(dto.password, customer.password);
    if (!passwordValid) {
      throw new UnauthorizedException("Invalid email or password.");
    }

    return this.signToken(customer.id, customer.email, customer.firstName, customer.lastName);
  }

  private signToken(id: string, email: string, firstName: string, lastName: string) {
    const token = this.jwt.sign({ sub: id, email });
    return {
      accessToken: token,
      customer: { id, email, firstName, lastName },
    };
  }
      async updateProfile(
    customerId: string,
    dto: {
      firstName?: string;
      lastName?: string;
      phone?: string;
      marketingOptIn?: boolean;
      reservationReminders?: boolean;
    }
  ) {
    const customer = await this.prisma.customer.update({
      where: { id: customerId },
      data: dto,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        marketingOptIn: true,
        reservationReminders: true,
      },
    });
    return customer;
  }

  async changePassword(
    customerId: string,
    dto: { currentPassword: string; newPassword: string }
  ) {
    const customer = await this.prisma.customer.findUnique({
      where: { id: customerId },
    });
    if (!customer) throw new UnauthorizedException();

    const valid = await bcrypt.compare(dto.currentPassword, customer.password);
    if (!valid) {
      throw new UnauthorizedException("Current password is incorrect.");
    }

    const hashed = await bcrypt.hash(dto.newPassword, 10);
    await this.prisma.customer.update({
      where: { id: customerId },
      data: { password: hashed },
    });

    return { success: true };
  }

    async deleteAccount(customerId: string) {
    const customer = await this.prisma.customer.findUnique({
      where: { id: customerId },
    });
    if (!customer) throw new UnauthorizedException();

    await this.prisma.customer.update({
      where: { id: customerId },
      data: {
        email: `deleted-${customerId}@asteria-deleted.com`,
        firstName: "Deleted",
        lastName: "User",
        phone: null,
        password: await bcrypt.hash(crypto.randomUUID(), 10), // unusable random password
        deletedAt: new Date(),
      },
    });

    return { success: true };
  }

    async requestPasswordReset(email: string) {
    const customer = await this.prisma.customer.findUnique({ where: { email } });
    // Always return success, even if no account exists — never reveal which emails are registered.
    if (!customer || customer.deletedAt) {
      return { success: true };
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await this.prisma.customer.update({
      where: { id: customer.id },
      data: { resetToken: token, resetTokenExpiry: expiry },
    });

    const resetUrl = `http://localhost:3000/reset-password?token=${token}`;
    await this.email.send(
      customer.email,
      "Reset your Asteria password",
      `<p>Hi ${customer.firstName},</p>
       <p>Click below to reset your password. This link expires in 1 hour.</p>
       <p><a href="${resetUrl}">Reset Password</a></p>
       <p>If you didn't request this, you can safely ignore this email.</p>`
    );

    return { success: true };
  }

  async resetPassword(token: string, newPassword: string) {
    const customer = await this.prisma.customer.findFirst({
      where: { resetToken: token, resetTokenExpiry: { gt: new Date() } },
    });
    if (!customer) {
      throw new UnauthorizedException("This reset link is invalid or has expired.");
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    await this.prisma.customer.update({
      where: { id: customer.id },
      data: { password: hashed, resetToken: null, resetTokenExpiry: null },
    });

    return { success: true };
  }
}