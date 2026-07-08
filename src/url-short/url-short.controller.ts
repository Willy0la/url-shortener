import {
  Body,
  Controller,
  Post,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/Guard/auth.guard';
import { UrlShortService } from './url-short.service';
import { CreateUrlDto } from 'src/dtos/url-dto/createUrl.dto';

@Controller('url-short')
export class UrlShortController {
  constructor(private readonly urlShortService: UrlShortService) {}

  @UseGuards(JwtAuthGuard) 
  @Post('shorten')
  async createUrl(@Body() dto: CreateUrlDto, @Req() req: any) {
    const userId = req.user.id;
    return await this.urlShortService.createUrl(userId, dto);
  }
}
