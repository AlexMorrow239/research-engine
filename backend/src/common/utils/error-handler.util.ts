/**
 * Utility class for standardized error handling across services
 * Provides centralized error processing, logging, and transformation
 */

import {
  BadRequestException,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  Type,
  UnauthorizedException,
} from '@nestjs/common';
import { MongoServerError } from 'mongodb';

export class ErrorHandler {
  /**
   * Handles service-level errors with consistent logging and error transformation
   *
   * @param logger NestJS logger instance for error logging
   * @param error The caught error
   * @param context Description of the operation that failed
   * @param details Additional error context details
   * @param knownErrors Array of error types that should be rethrown without transformation
   * @throws The original error if it's in knownErrors, otherwise an InternalServerErrorException
   *
   * @example
   * try {
   *   await this.userService.updateUser(userId, data);
   * } catch (error) {
   *   ErrorHandler.handleServiceError(
   *     this.logger,
   *     error,
   *     'update user',
   *     { userId, data },
   *     [NotFoundException]
   *   );
   * }
   */
  static handleServiceError(
    logger: Logger,
    error: Error,
    context: string,
    details?: Record<string, any>,
    knownErrors: Type<Error>[] = [NotFoundException, UnauthorizedException],
  ): never {
    // Log the error with context and details
    logger.error(
      `Failed to ${context}`,
      {
        ...details,
        error: error.message,
        stack: error.stack,
      },
      error.constructor.name,
    );

    // Handle JWT token expiration
    if (error.name === 'TokenExpiredError') {
      throw new UnauthorizedException({
        message: 'Your session has expired',
        expired: true,
      });
    }

    // Check if error is a known type that should be rethrown
    if (knownErrors.some((errorType) => error instanceof errorType)) {
      // If it's an UnauthorizedException with expired flag, preserve that information
      if (
        error instanceof UnauthorizedException &&
        error.getResponse() &&
        typeof error.getResponse() === 'object' &&
        error.getResponse() !== null &&
        'expired' in (error.getResponse() as object)
      ) {
        throw error;
      }
      throw error;
    }

    // Handle MongoDB specific errors
    if (error instanceof MongoServerError) {
      if (error.code === 11000) {
        throw new BadRequestException('A record with this information already exists');
      }
    }

    // Transform unknown errors to InternalServerError
    throw new InternalServerErrorException(`Failed to ${context}`);
  }
}
