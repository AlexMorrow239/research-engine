import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TokenExpiredError } from 'jsonwebtoken';
import { ErrorHandler } from '@/common/utils/error-handler.util';
import { CustomLogger } from '@/common/services/logger.service';

/**
 * Guard implementing JWT authentication for protected routes.
 * Extends Passport's AuthGuard to provide JWT-specific handling.
 *
 * Features:
 * - Automatic JWT extraction and validation
 * - Token expiration handling
 * - Custom error responses
 *
 * Usage:
 * ```typescript
 * @UseGuards(JwtAuthGuard)
 * @Get('protected-route')
 * async someProtectedMethod() {
 *   // Only accessible with valid JWT
 * }
 * ```
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly logger: CustomLogger) {
    super();
    this.logger.setContext('JwtAuthGuard');
  }

  /**
   * Custom request handler for JWT authentication.
   * Provides specific error handling for common JWT issues.
   *
   * Error Handling:
   * - Token expiration: Returns 401 with expired flag
   * - Invalid token: Returns standard 401
   * - Missing token: Returns standard 401
   *
   * @param err - Authentication error if any
   * @param user - Authenticated user if successful
   * @param info - Additional auth info (like token errors)
   * @returns Authenticated user or throws auth error
   */
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
        { error: error?.message },
        [UnauthorizedException],
      );
    }
  }
}
