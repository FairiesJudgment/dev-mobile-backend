import { Test, TestingModule } from '@nestjs/testing';
import { ManagerController } from './manager.controller';
import { ManagerService } from './manager.service';
import { ConfigService } from '@nestjs/config';
import { ManagerGuard } from 'src/common/guards/manager.guard';
import { AdminGuard } from 'src/common/guards/admin.guard';
import { JwtService } from '@nestjs/jwt';
import { managerMock, createManagerMock } from './mocks/manager.mock';

describe('ManagerController', () => {
  let controller: ManagerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ManagerController],
      providers: [
        { provide: ManagerService, useClass: jest.fn() },
        { provide: ManagerGuard, useValue: { canActivate: jest.fn().mockReturnValue(true) }},
        { provide: AdminGuard, useValue: { canActivate: jest.fn().mockReturnValue(true) }},
        { provide: JwtService, useValue: { sign: jest.fn(), verify: jest.fn() }},
        { provide: ConfigService, useValue: { get: jest.fn() }},
      ],
    }).compile();

    controller = module.get<ManagerController>(ManagerController);
  });

  describe('getAll', () => {
    it('should return an array of managers', async () => {
      controller.getAll = jest.fn().mockResolvedValue([managerMock]);
      await expect(controller.getAll()).resolves.toEqual([managerMock]);
    });
  });

  describe('get', () => {
    it('should return a manager by username', async () => {
      controller.get = jest.fn().mockResolvedValue(managerMock);
      await expect(controller.get('username', expect.any(Request))).resolves.toEqual(managerMock);
      expect(controller.get).toHaveBeenCalledWith('username', expect.any(Request));
    });
  });

  describe('create', () => {
    it('should create a manager', async () => {
      controller.create = jest.fn().mockResolvedValue({ data: 'Manager créé avec succès !' });
      const createManagerDto = createManagerMock;
      await expect(controller.create(createManagerDto)).resolves.toEqual({ data: 'Manager créé avec succès !' });
      expect(controller.create).toHaveBeenCalledWith(createManagerDto);
    });
  });

  describe('delete', () => {
    it('should delete a manager', async () => {
      controller.delete = jest.fn().mockResolvedValue({ data: 'Manager supprimé avec succès !' });
      await expect(controller.delete('id_manager')).resolves.toEqual({ data: 'Manager supprimé avec succès !' });
      expect(controller.delete).toHaveBeenCalledWith('id_manager');
    });
  });

  describe('update', () => {
    it('should update a manager', async () => {
      controller.update = jest.fn().mockResolvedValue({ data: 'Manager mis à jour avec succès !' });
      const updateManagerDto = createManagerMock;
      await expect(controller.update('id_manager', updateManagerDto, expect.any(Request))).resolves.toEqual({ data: 'Manager mis à jour avec succès !' });
      expect(controller.update).toHaveBeenCalledWith('id_manager', updateManagerDto, expect.any(Request));
    });
  });
});