/**
 * Utility class for standardized error handling across services
 * Provides centralized error processing, logging, and transformation
 */
import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
  Type,
  UnauthorizedException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { MongoServerError } from 'mongodb';
import { CustomLogger } from '@common/services/logger.service';

export class ErrorHandler {
  /**
   * Handles service-level errors with consistent logging and error transformation
   *
   * @param logger CustomLogger instance for error logging
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
    logger: CustomLogger,
    error: Error,
    context: string,
    details?: Record<string, any>,
    knownErrors: Type<Error>[] = [NotFoundException, UnauthorizedException],
  ): never {
    const errorMessage = error?.message || 'Unknown error occurred';
    const errorStack = error?.stack;
    const errorName = error?.constructor?.name || 'UnknownError';
    const timestamp = new Date().toISOString();

    // Prepare structured log data
    const logData = {
      timestamp,
      operation: context,
      errorType: errorName,
      errorMessage,
      ...details,
    };

    // Handle JWT token expiration
    if (error.name === 'TokenExpiredError') {
      logger.warn(
        `Token expired during ${context}`,
        JSON.stringify({
          ...logData,
          stack: errorStack,
        }),
      );
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
        logger.warn(
          `Authentication failed during ${context}`,
          JSON.stringify({
            ...logData,
            stack: errorStack,
          }),
        );
        throw error;
      }

      // Log known errors as warnings
      logger.warn(
        `Known error occurred during ${context}`,
        JSON.stringify({
          ...logData,
          stack: errorStack,
        }),
      );
      throw error;
    }

    // Handle MongoDB specific errors
    if (error instanceof MongoServerError) {
      if (error.code === 11000) {
        logger.warn(
          `Duplicate key error during ${context}`,
          JSON.stringify({
            ...logData,
            mongoError: error.code,
            stack: errorStack,
          }),
        );
        throw new BadRequestException('A record with this information already exists');
      }

      // Log other MongoDB errors as errors
      logger.error(
        `MongoDB error during ${context}`,
        JSON.stringify({
          ...logData,
          mongoError: error.code,
          stack: errorStack,
        }),
      );
    }

    // Handle HTTP exceptions differently
    if (error instanceof HttpException) {
      logger.error(
        `HTTP exception during ${context}`,
        JSON.stringify({
          ...logData,
          statusCode: error.getStatus(),
          stack: errorStack,
        }),
      );
      throw error;
    }

    // Log unknown errors as critical errors
    logger.error(
      `Unhandled error during ${context}`,
      JSON.stringify({
        ...logData,
        stack: errorStack,
        severity: 'CRITICAL',
      }),
    );

    // Transform unknown errors to InternalServerError
    throw new InternalServerErrorException({
      message: `Failed to ${context}`,
      errorId: timestamp, // Can be used to correlate logs with client errors
    });
  }
}
