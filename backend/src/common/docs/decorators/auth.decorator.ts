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
import { CreateProfessorDto, RegisterProfessorDto } from '@/common/dto/professors';

import { AuthDescriptions } from '../descriptions/auth.description';
import { loginExamples, registerExamples } from '../examples/auth.examples';
import { ForgotPasswordDto } from '@/common/dto/auth/forgot-password.dto';
import { ResetPasswordDto } from '@/common/dto/auth/reset-password.dto';

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
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      description: AuthDescriptions.responses.serverError,
    }),
  );

export const ApiRegister = () =>
  applyDecorators(
    ApiOperation(AuthDescriptions.register),
    ApiBody({ type: RegisterProfessorDto, examples: registerExamples }),
    ApiResponse({
      status: HttpStatus.CREATED,
      description: AuthDescriptions.responses.registrationSuccess,
      type: LoginResponseDto,
    }),
    ApiBadRequestResponse({
      description: AuthDescriptions.responses.registrationError,
    }),
    ApiResponse({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      description: AuthDescriptions.responses.serverError,
    }),
  );

export const ApiForgotPassword = () =>
  applyDecorators(
    ApiOperation(AuthDescriptions.forgotPassword),
    ApiBody({ type: ForgotPasswordDto }),
    ApiResponse({
      status: HttpStatus.OK,
      description: AuthDescriptions.responses.forgotPasswordSuccess,
    }),
    ApiBadRequestResponse({
      description: AuthDescriptions.responses.invalidPasswordFormat,
    }),
  );

export const ApiResetPassword = () =>
  applyDecorators(
    ApiOperation(AuthDescriptions.resetPassword),
    ApiBody({ type: ResetPasswordDto }),
    ApiResponse({
      status: HttpStatus.OK,
      description: AuthDescriptions.responses.resetPasswordSuccess,
    }),
    ApiBadRequestResponse({
      description: AuthDescriptions.responses.invalidPasswordFormat,
    }),
    ApiUnauthorizedResponse({
      description: AuthDescriptions.responses.invalidResetToken,
    }),
  );
