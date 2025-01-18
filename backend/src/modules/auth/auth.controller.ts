import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiLogin, ApiRegister } from '@/common/docs';
import { LoginDto } from '@/common/dto/auth/login.dto';
import { CreateProfessorDto } from '@/common/dto/professors';
import { LoginResponseDto } from '@/common/dto/auth/login-response.dto';
import { AuthService } from './auth.service';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiRegister()
  async register(@Body() createProfessorDto: CreateProfessorDto): Promise<LoginResponseDto> {
    return await this.authService.register(createProfessorDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiLogin()
  async login(@Body() loginDto: LoginDto): Promise<LoginResponseDto> {
    return await this.authService.login(loginDto.email, loginDto.password);
  }
}
