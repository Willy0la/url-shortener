import { BadRequestException, Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { BaseService } from 'src/base/base.service';
import { CreateUrlDto } from '../dtos/url-dto/createUrl.dto';
import { nanoid } from 'nanoid';
import { successResponse } from 'src/ApiResponse/auth.apiresponse';
import { urlSanitizer } from 'src/auth/sanitizer/user.sanitizer';

@Injectable()
export class UrlShortService {
  constructor(private readonly urlService: BaseService) {}

  async createUrl(userId: string, dto: CreateUrlDto) {
    const { customCode } = dto;
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('Invalid Credential');
    }

    const shortCode = customCode ?? nanoid(8);
    const existing = await this.urlService.findShortCode(shortCode);

    if (existing) {
      throw new BadRequestException('Short Code already exists');
    }
    const newUrl = await this.urlService.createUrlUser(userId, dto, shortCode);
    const sanitized = urlSanitizer(newUrl);
    return successResponse('Url Successfully Created', {
      url: sanitized,
    });
  }
}
