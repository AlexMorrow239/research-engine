export interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
  from: string;
  replyTo: string;
  headers?: {
    "Auto-Submitted"?: string;
    "X-Auto-Response-Suppress"?: string;
  };
}
