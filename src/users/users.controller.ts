import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/Guard/auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getUser(@Req() req: Request & { user: { id: string } }) {
    const userId = req.user.id;
    return await this.userService.getUserById(userId);
  }
}
