import { Test, TestingModule } from '@nestjs/testing';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { ConfigService } from '@nestjs/config';
import { ManagerGuard } from 'src/common/guards/manager.guard';
import { JwtService } from '@nestjs/jwt';
import { gameMock } from './mocks/game.mock';
import { ManagerService } from 'src/manager/manager.service';

describe('GameController', () => {
  let controller: GameController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GameController],
      providers: [
        { provide: GameService, useClass: jest.fn() },
        { provide: ManagerService, useClass: jest.fn() },
        { provide: ManagerGuard, useValue: { canActivate: jest.fn().mockReturnValue(true) }},
        { provide: JwtService, useValue: { sign: jest.fn(), verify: jest.fn() }},
        { provide: ConfigService, useValue: { get: jest.fn() }},
      ],
    }).compile();

    controller = module.get<GameController>(GameController);
  });

  describe('getAll', () => {
    it('should return an array of games', async () => {
      controller.getAll = jest.fn().mockResolvedValue([gameMock]);
      await expect(controller.getAll()).resolves.toEqual([gameMock]);
    });
  });

  describe('get', () => {
    it('should return a game by id', async () => {
      controller.get = jest.fn().mockResolvedValue(gameMock);
      await expect(controller.get(1)).resolves.toEqual(gameMock);
      expect(controller.get).toHaveBeenCalledWith(1);
    });
  });

  describe('create', () => {
    it('should create a game', async () => {
      controller.create = jest.fn().mockResolvedValue({ data: 'Jeu créé avec succès !' });
      const createGameMockDto = gameMock;
      await expect(controller.create(createGameMockDto)).resolves.toEqual({ data: 'Jeu créé avec succès !' });
      expect(controller.create).toHaveBeenCalledWith(createGameMockDto);
    });
  });

  describe('update', () => {
    it('should update a game', async () => {
      controller.update = jest.fn().mockResolvedValue({ data: 'Jeu mis à jour avec succès !' });
      const updateGameMockDto = gameMock;
      await expect(controller.update(1, updateGameMockDto)).resolves.toEqual({ data: 'Jeu mis à jour avec succès !' });
      expect(controller.update).toHaveBeenCalledWith(1, updateGameMockDto);
    });
  });

  describe('delete', () => {
    it('should delete a game', async () => {
      controller.delete = jest.fn().mockResolvedValue({ data: 'Jeu supprimé avec succès !' });
      await expect(controller.delete(1)).resolves.toEqual({ data: 'Jeu supprimé avec succès !' });
      expect(controller.delete).toHaveBeenCalledWith(1);
    });
  });
});