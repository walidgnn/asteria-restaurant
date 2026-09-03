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

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService
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
    if (!customer) {
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
    dto: { firstName?: string; lastName?: string; phone?: string }
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
      },
    });
    return customer;
  }
}