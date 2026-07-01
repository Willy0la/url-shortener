import { Module } from '@nestjs/common';
import { UrlShortController } from './url-short.controller';
import { UrlShortService } from './url-short.service';

@Module({
  controllers: [UrlShortController],
  providers: [UrlShortService]
})
export class UrlShortModule {}
