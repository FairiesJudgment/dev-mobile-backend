import { Test, TestingModule } from '@nestjs/testing';
import { SaleService } from './sale.service';
import { PrismaService } from 'src/prisma/prisma.service';

describe('SaleService', () => {
  let service: SaleService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SaleService,
        {
          provide: PrismaService,
          useValue: {
            saleTransaction: {
              findMany: jest.fn(),
              findUnique: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
            gameInSaleTransaction: {
              findMany: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<SaleService>(SaleService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});