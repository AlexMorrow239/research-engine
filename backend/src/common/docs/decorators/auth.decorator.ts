import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { LoginResponseDto } from '@/common/dto/auth/login-response.dto';
import { LoginDto } from '@/common/dto/auth/login.dto';

import { AuthDescriptions } from '../descriptions/auth.description';
import { loginExamples } from '../examples/auth.examples';
import { CreateProfessorDto } from '@/common/dto/professors';

export const ApiLogin = () =>
  applyDecorators(
    ApiOperation(AuthDescriptions.login),
    ApiBody({ type: LoginDto, examples: loginExamples }),
    ApiResponse({
      status: HttpStatus.OK,
      description: AuthDescriptions.responses.loginSuccess,
      type: LoginResponseDto,
    }),
    ApiUnauthorizedResponse({
      description: AuthDescriptions.responses.invalidCredentials,
    }),
    ApiResponse({
      status: HttpStatus.FORBIDDEN,
      description: AuthDescriptions.responses.inactiveAccount,
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: AuthDescriptions.responses.invalidEmailDomain,
    }),
    ApiResponse({
      status: HttpStatus.TOO_MANY_REQUESTS,
      description: AuthDescriptions.responses.tooManyAttempts,
    }),
    ApiResponse({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      description: AuthDescriptions.responses.serverError,
    }),
  );

export const ApiRegister = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Register new professor',
      description: 'Create new professor account and return access token',
    }),
    ApiBody({ type: CreateProfessorDto }),
    ApiResponse({
      status: HttpStatus.CREATED,
      description: 'Professor account created successfully',
      type: LoginResponseDto,
    }),
    ApiBadRequestResponse({
      description: 'Invalid input data (email domain, password format)',
    }),
    ApiUnauthorizedResponse({
      description: 'Invalid admin password',
    }),
  );
