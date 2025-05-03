import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ChangePasswordDto } from './dto/change-password.tto';
import { CreateAuthDto } from './dto/create-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.create(createAuthDto);
  }

  @Post('change-password')
  changePassword(@Body() changePasswordDto: ChangePasswordDto) {
    return this.authService.changePassword(changePasswordDto);
  }

  @Post('send-email')
  sendVerificationEmail(@Body('email') email: string) {
    return this.authService.sendVerificationEmail(email);
  }

  @Post('verify')
  verifyToken() {
    return this.authService.verifyToken();
  }
}
