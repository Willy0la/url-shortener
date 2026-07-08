import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from 'src/dtos/auth-dto/signup.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @ApiOperation({ summary: 'Create a new user account' })
  @Post('register')
  async createUser(@Body() dto: SignUpDto) {
    return await this.authService.createUser(dto);
  }
  @ApiOperation({ summary: 'Login as a user' })
  @Post('register')
  async loginUse(@Body() dto: SignUpDto) {
    return await this.authService.createUser(dto);
  }
}
