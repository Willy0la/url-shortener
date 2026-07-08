import { Module } from '@nestjs/common';
import { UrlShortController } from './url-short.controller';
import { UrlShortService } from './url-short.service';
import { BaseModule } from 'src/base/base.module';

@Module({
  imports: [BaseModule],
  controllers: [UrlShortController],
  providers: [UrlShortService],
})
export class UrlShortModule {}
