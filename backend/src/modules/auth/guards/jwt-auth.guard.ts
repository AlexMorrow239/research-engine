import {
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";

import { ErrorHandler } from "@/common/utils/error-handler.util";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  private readonly logger = new Logger(JwtAuthGuard.name);

  handleRequest(err: any, user: any, info: Error | null) {
    try {
      if (info instanceof TokenExpiredError) {
        throw new UnauthorizedException({
          message: "Your session has expired",
          expired: true,
        });
      }

      if (err || !user) {
        throw err || new UnauthorizedException();
      }

      return user;
    } catch (error) {
      ErrorHandler.handleServiceError(
        this.logger,
        error,
        "authenticate request",
        { error: error.message },
        [UnauthorizedException]
      );
    }
  }
}
