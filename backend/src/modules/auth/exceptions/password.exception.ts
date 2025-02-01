import { UnauthorizedException } from '@nestjs/common';

/**
 * Custom exception for invalid admin password attempts.
 * Provides specific error message for admin authentication failures.
 *
 * Usage:
 * Thrown when validating admin password for protected operations like:
 * - Professor registration
 * - System configuration changes
 * - Administrative actions
 */
export class InvalidAdminPasswordException extends UnauthorizedException {
  constructor() {
    super('Invalid admin password. Please contact the system administrator.');
  }
}
