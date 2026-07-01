import { Test, TestingModule } from '@nestjs/testing';
import { UrlShortController } from './url-short.controller';

describe('UrlShortController', () => {
  let controller: UrlShortController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UrlShortController],
    }).compile();

    controller = module.get<UrlShortController>(UrlShortController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
