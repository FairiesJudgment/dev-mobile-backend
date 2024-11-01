import { Test, TestingModule } from '@nestjs/testing';
import { ManagerService } from './manager.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { managerMock, createManagerMock } from './mocks/manager.mock';
import { sellerMock } from 'src/seller/mocks/seller.mock';

describe('ManagerService', () => {
  let service: ManagerService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ManagerService,
        {
          provide: PrismaService,
          useValue: {
            manager: {
              findMany: jest.fn().mockResolvedValue([managerMock]),
              findUnique: jest.fn().mockResolvedValue(managerMock),
              create: jest.fn().mockResolvedValue(managerMock),
              update: jest.fn().mockResolvedValue(managerMock),
              delete: jest.fn().mockResolvedValue(managerMock),
            },
            seller: {
              findUnique: jest.fn().mockResolvedValue(null)
            }
          },
        },
      ],
    }).compile();

    service = module.get<ManagerService>(ManagerService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAll', () => {
    it('should return an array of managers', async () => {
      const result = await service.getAll();
      expect(result).toEqual([managerMock]);
      expect(prismaService.manager.findMany).toHaveBeenCalled();
    });
  });

  describe('get', () => {
    it('should return a manager by username', async () => {
      const result = await service.get('username', 'asker_id');
      expect(result).toEqual(managerMock);
      expect(prismaService.manager.findUnique).toHaveBeenCalledWith({ where: { username: 'username' } });
    });

    it('should throw NotFoundException if manager not found', async () => {
      jest.spyOn(prismaService.manager, 'findUnique').mockResolvedValue(null);
      await expect(service.get('username', 'asker_id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    // it('should create a manager', async () => {
    //   jest.spyOn(prismaService.manager, 'findUnique').mockResolvedValue(null);
    //   jest.spyOn(prismaService.seller, 'findUnique').mockResolvedValue(null);
    // const createManagerDto = createManagerMock;
    //   const result = await service.create(createManagerDto);
    //   expect(result).toEqual({ data: 'Manager créé avec succès !' });
    //   expect(prismaService.manager.create).toHaveBeenCalledWith({
    //     data: createManagerDto,
    //   });
    // });

    it('should throw ConflictException if manager email already exists', async () => {
      jest.spyOn(prismaService.manager, 'findUnique').mockResolvedValue(managerMock);
      const createManagerDto = createManagerMock;
      await expect(service.create(createManagerDto)).rejects.toThrow(ConflictException);
    });

    it('should throw ConflictException if seller email already exists', async () => {
      jest.spyOn(prismaService.seller, 'findUnique').mockResolvedValue(sellerMock);
      const createManagerDto = createManagerMock;
      await expect(service.create(createManagerDto)).rejects.toThrow(ConflictException);
    });
  });

  describe('update', () => {
    // it('should update a manager', async () => {
    //     jest.spyOn(prismaService.manager, 'findUnique').mockResolvedValue(managerMock);
    //     jest.spyOn(service, 'findManager').mockResolvedValue(null);
    //   const updateManagerDto = createManagerMock;
    //   const result = await service.update('id_manager', updateManagerDto, 'asker_id');
    //   expect(result).toEqual({data: 'Manager modifié !'});
    //   expect(prismaService.manager.update).toHaveBeenCalledWith({
    //     where: { id_manager: 'id_manager' },
    //     data: updateManagerDto,
    //   });
    // });

    it('should throw NotFoundException if manager not found', async () => {
      jest.spyOn(prismaService.manager, 'findUnique').mockResolvedValue(null);
      const updateManagerDto = createManagerMock;
      await expect(service.update('id_manager', updateManagerDto, 'asker_id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('should delete a manager', async () => {
      const result = await service.delete('id_manager');
      expect(result).toEqual({data: 'Manager supprimé !'});
      expect(prismaService.manager.delete).toHaveBeenCalledWith({ where: { id_manager: 'id_manager' } });
    });

    it('should throw NotFoundException if manager not found', async () => {
      jest.spyOn(prismaService.manager, 'findUnique').mockResolvedValue(null);
      await expect(service.delete('id_manager')).rejects.toThrow(NotFoundException);
    });
  });
});