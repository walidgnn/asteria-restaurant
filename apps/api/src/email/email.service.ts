import { Injectable, Logger } from "@nestjs/common";
import { Resend } from "resend";

@Injectable()
export class EmailService {
  private resend: Resend;
  private logger = new Logger(EmailService.name);

  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY);
  }

  async send(to: string, subject: string, html: string) {
    try {
      const result = await this.resend.emails.send({
        from: process.env.EMAIL_FROM!,
        to,
        subject,
        html,
      });
      this.logger.log(`Email sent to ${to}: ${subject}`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to send email to ${to}`, error);
      // We deliberately don't throw here — a failed email should never
      // block the actual action (e.g. order creation) from succeeding.
    }
  }
}