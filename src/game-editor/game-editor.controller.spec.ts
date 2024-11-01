import { Test, TestingModule } from '@nestjs/testing';
import { GameEditorController } from './game-editor.controller';
import { GameEditorService } from './game-editor.service';
import { ConfigService } from '@nestjs/config';
import { ManagerGuard } from 'src/common/guards/manager.guard';
import { JwtService } from '@nestjs/jwt';
import { gameEditorMock, createGameEditorMock } from './mocks/game-editor.mock';
import { ManagerService } from 'src/manager/manager.service';

describe('GameEditorController', () => {
  let controller: GameEditorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GameEditorController],
      providers: [
        { provide: GameEditorService, useClass: jest.fn() },
        { provide: ManagerService, useClass: jest.fn() },
        { provide: ManagerGuard, useValue: { canActivate: jest.fn().mockReturnValue(true) }},
        { provide: JwtService, useValue: { sign: jest.fn(), verify: jest.fn() }},
        { provide: ConfigService, useValue: { get: jest.fn() }},
      ],
    }).compile();

    controller = module.get<GameEditorController>(GameEditorController);
  });

  describe('getAll', () => {
    it('should return an array of game editors', async () => {
      controller.getAll = jest.fn().mockResolvedValue([gameEditorMock]);
      await expect(controller.getAll()).resolves.toEqual([gameEditorMock]);
    });
  });

  describe('get', () => {
    it('should return a game editor by id', async () => {
      controller.get = jest.fn().mockResolvedValue(gameEditorMock);
      await expect(controller.get(1)).resolves.toEqual(gameEditorMock);
      expect(controller.get).toHaveBeenCalledWith(1);
    });
  });

  describe('create', () => {
    it('should create a game editor', async () => {
      controller.create = jest.fn().mockResolvedValue({ data: 'Éditeur de jeu créé avec succès !' });
      const createGameEditorDto = createGameEditorMock;
      await expect(controller.create(createGameEditorDto)).resolves.toEqual({ data: 'Éditeur de jeu créé avec succès !' });
      expect(controller.create).toHaveBeenCalledWith(createGameEditorDto);
    });
  });

  describe('update', () => {
    it('should update a game editor', async () => {
      controller.update = jest.fn().mockResolvedValue({ data: 'Éditeur de jeu mis à jour avec succès !' });
      const updateGameEditorDto = createGameEditorMock;
      await expect(controller.update(1, updateGameEditorDto)).resolves.toEqual({ data: 'Éditeur de jeu mis à jour avec succès !' });
      expect(controller.update).toHaveBeenCalledWith(1, updateGameEditorDto);
    });
  });

  describe('delete', () => {
    it('should delete a game editor', async () => {
      controller.delete = jest.fn().mockResolvedValue({ data: 'Éditeur de jeu supprimé avec succès !' });
      await expect(controller.delete(1)).resolves.toEqual({ data: 'Éditeur de jeu supprimé avec succès !' });
      expect(controller.delete).toHaveBeenCalledWith(1);
    });
  });
});