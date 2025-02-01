import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  ApiChangePassword,
  ApiDeactivateAccount,
  ApiGetProfile,
  ApiReactivateAccount,
  ApiUpdateProfile,
} from '@/common/docs/decorators/professors.decorator';
import {
  ChangePasswordDto,
  ProfessorResponseDto,
  ReactivateAccountDto,
  UpdateProfessorDto,
} from '@/common/dto/professors';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { GetProfessor } from '@/modules/professors/decorators/get-professor.decorator';
import { ProfessorsService } from '@/modules/professors/professors.service';
import { Professor } from '@/modules/professors/schemas/professors.schema';

/**
 * Controller handling professor-related HTTP endpoints.
 * Groups functionality into:
 * - Profile management (view/update)
 * - Security operations (password change)
 * - Account status management (deactivation/reactivation)
 *
 * Authentication:
 * - Most endpoints require JWT authentication via JwtAuthGuard
 * - Reactivation endpoint is public but requires admin password
 *
 * Note: Some professor service methods are not exposed here as they are used
 * directly by the AuthModule (e.g., createProfessor).
 */
@ApiTags('Professors')
@Controller('professors')
@ApiBearerAuth()
export class ProfessorsController {
  constructor(private readonly professorsService: ProfessorsService) {}

  //#region Profile Management

  /**
   * Retrieves the authenticated professor's profile.
   * Uses JWT token to identify the professor.
   *
   * @route GET /professors/profile
   * @security JWT
   */
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiGetProfile()
  async getProfile(@GetProfessor() professor: Professor): Promise<ProfessorResponseDto> {
    return await this.professorsService.getProfessor(professor.id);
  }

  /**
   * Updates the authenticated professor's profile information.
   * Only allows updating non-sensitive fields defined in UpdateProfessorDto.
   *
   * @route PATCH /professors/profile
   * @security JWT
   */
  @Patch('profile')
  @UseGuards(JwtAuthGuard)
  @ApiUpdateProfile()
  async updateProfile(
    @GetProfessor() professor: Professor,
    @Body() updateProfileDto: UpdateProfessorDto,
  ): Promise<ProfessorResponseDto> {
    return await this.professorsService.updateProfessor(professor.id, updateProfileDto);
  }

  //#endregion

  //#region Security Operations

  /**
   * Changes the authenticated professor's password.
   * Requires current password verification.
   *
   * @route POST /professors/change-password
   * @security JWT
   */
  @Post('change-password')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiChangePassword()
  async changePassword(
    @GetProfessor() professor: Professor,
    @Body() changePasswordDto: ChangePasswordDto,
  ): Promise<void> {
    await this.professorsService.changeProfessorPassword(
      professor.id,
      changePasswordDto.currentPassword,
      changePasswordDto.newPassword,
    );
  }

  //#endregion

  //#region Account Status Management

  /**
   * Deactivates the authenticated professor's account.
   * Account remains in database but cannot be used until reactivated.
   *
   * @route DELETE /professors/deactivate
   * @security JWT
   */
  @Delete('deactivate')
  @UseGuards(JwtAuthGuard)
  @ApiDeactivateAccount()
  async deactivateAccount(@GetProfessor() professor: Professor): Promise<void> {
    await this.professorsService.deactivateProfessorAccount(professor.id);
  }

  /**
   * Reactivates a previously deactivated professor account.
   * Requires both professor credentials and admin password.
   * This is a public endpoint to allow deactivated professors to reactivate.
   *
   * @route POST /professors/reactivate
   * @public
   */
  @Post('reactivate')
  @HttpCode(HttpStatus.OK)
  @ApiReactivateAccount()
  async reactivateAccount(@Body() reactivateAccountDto: ReactivateAccountDto): Promise<void> {
    await this.professorsService.reactivateProfessorAccount(reactivateAccountDto);
  }

  //#endregion
}
