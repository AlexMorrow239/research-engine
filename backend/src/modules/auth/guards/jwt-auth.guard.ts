import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { TokenExpiredError } from 'jsonwebtoken';

import { ErrorHandler } from '@/common/utils/error-handler.util';
import { CustomLogger } from '@/common/services/logger.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly logger: CustomLogger) {
    super();
  }
  handleRequest(err: any, user: any, info: Error | null) {
    try {
      if (info instanceof TokenExpiredError) {
        throw new UnauthorizedException({
          message: 'Your session has expired',
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
        'authenticate request',
        { error: error.message },
        [UnauthorizedException],
      );
    }
  }
}
