import { Test, TestingModule } from '@nestjs/testing';
import { SaleController } from './sale.controller';
import { SaleService } from './sale.service';
import { ManagerGuard } from 'src/common/guards/manager.guard';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AdminGuard } from 'src/common/guards/admin.guard';
import { ManagerService } from 'src/manager/manager.service';

describe('SaleController', () => {
  let controller: SaleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SaleController],
      providers: [
        { provide: SaleService, useClass: jest.fn() },
        { provide: ManagerService, useClass: jest.fn() },
        { provide: ManagerGuard, useValue: { canActivate: jest.fn().mockReturnValue(true) }},
        { provide: AdminGuard, useValue: { canActivate: jest.fn().mockReturnValue(true) }},
        { provide: JwtService, useValue: { sign: jest.fn(), verify: jest.fn() }},
        { provide: ConfigService, useValue: { get: jest.fn() }},
      ],
    }).compile();

    controller = module.get<SaleController>(SaleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});