import { Body, Controller, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/registerDto.dto';
import { LoginDto } from './dto/loginDto.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto'
import { ResetPasswordDto } from './dto/reset-password.dto';
import { JwtAuthGuard } from './guards/jwt.guard';

@Controller('auth')
export class AuthController {

  constructor(private readonly authService: AuthService) {}


  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }
 
  @Post('login')
async login(@Body() dto: LoginDto) {
  const user = await this.authService.validateUser(dto.email, dto.password);
  return this.authService.login(user); // ✅ FULL USER OBJECT
}
@Post('forgot-password')
forgotPassword(@Body() dto: ForgotPasswordDto) {
  return this.authService.forgotPassword(dto.email);
}

@Post('reset-password')
resetPassword(
  @Body('token') token: string,
  @Body('newPassword') newPassword: string,
) {
  return this.authService.resetPassword(token, newPassword);
}
}



