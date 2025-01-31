import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { EmailConfig } from "../interfaces/email-config.interface";

@Injectable()
export class EmailConfigService {
  constructor(private configService: ConfigService) {}

  getEmailConfig(): EmailConfig {
    const environment = this.configService.get<string>("NODE_ENV");
    const noreplyAddress = this.configService.get<string>(
      "SMTP_NOREPLY_ADDRESS",
      "noreply-research@miami.edu"
    );

    if (environment === "production") {
      return {
        host: this.configService.get<string>("SMTP_HOST", "smtp.miami.edu"),
        port: this.configService.get<number>("SMTP_PORT", 587),
        secure: true,
        auth: {
          user: this.configService.get<string>("SMTP_USER"),
          pass: this.configService.get<string>("SMTP_PASSWORD"),
        },
        from: noreplyAddress,
        replyTo: noreplyAddress,
        headers: {
          "Auto-Submitted": "auto-generated",
          "X-Auto-Response-Suppress": "All",
        },
      };
    }

    // Development/MVP configuration (Gmail)
    return {
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: this.configService.get<string>("SMTP_USER"),
        pass: this.configService.get<string>("SMTP_PASSWORD"),
      },
      from: noreplyAddress,
      replyTo: noreplyAddress,
      headers: {
        "Auto-Submitted": "auto-generated",
        "X-Auto-Response-Suppress": "All",
      },
    };
  }
}
