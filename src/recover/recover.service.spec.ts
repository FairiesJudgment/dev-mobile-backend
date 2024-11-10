import { Test, TestingModule } from '@nestjs/testing';
import { RecoverService } from './recover.service';

describe('RecoverService', () => {
  let service: RecoverService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RecoverService],
    }).compile();

    service = module.get<RecoverService>(RecoverService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
