import { Test, TestingModule } from '@nestjs/testing';
import { RecoverController } from './recover.controller';

describe('RecoverController', () => {
  let controller: RecoverController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RecoverController],
    }).compile();

    controller = module.get<RecoverController>(RecoverController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
