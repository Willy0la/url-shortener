import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { userSanitizer } from 'src/auth/sanitizer/user.sanitizer';
import { BaseService } from 'src/base/base.service';
import { User } from './users.schema';
import { successResponse } from 'src/ApiResponse/auth.apiresponse';

@Injectable()
export class UsersService {
  constructor(private readonly baseService: BaseService) {}

  async getUserById(id: string) {
    const user = await this.baseService.getUserById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const sanitized = userSanitizer(user);
    return successResponse('User fetched successfully', {
      data: sanitized,
    });
  }
}
