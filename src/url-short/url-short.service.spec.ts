import { Test, TestingModule } from '@nestjs/testing';
import { UrlShortService } from './url-short.service';

describe('UrlShortService', () => {
  let service: UrlShortService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UrlShortService],
    }).compile();

    service = module.get<UrlShortService>(UrlShortService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
