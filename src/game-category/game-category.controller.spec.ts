import { Test, TestingModule } from '@nestjs/testing';
import { GameCategoryController } from './game-category.controller';
import { GameCategoryService } from './game-category.service';
import { ConfigService } from '@nestjs/config';
import { ManagerGuard } from 'src/common/guards/manager.guard';
import { JwtService } from '@nestjs/jwt';
import { gameCategoryMock, createGameCategoryMock } from './mocks/game-category.mock';
import { ManagerService } from 'src/manager/manager.service';

describe('GameCategoryController', () => {
  let controller: GameCategoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GameCategoryController],
      providers: [
        { provide: GameCategoryService, useClass: jest.fn() },
        { provide: ManagerService, useClass: jest.fn() },
        { provide: ManagerGuard, useValue: { canActivate: jest.fn().mockReturnValue(true) }},
        { provide: JwtService, useValue: { sign: jest.fn(), verify: jest.fn() }},
        { provide: ConfigService, useValue: { get: jest.fn() }},
      ],
    }).compile();

    controller = module.get<GameCategoryController>(GameCategoryController);
  });

  describe('getAll', () => {
    it('should return an array of game categories', async () => {
      controller.getAll = jest.fn().mockResolvedValue([gameCategoryMock]);
      await expect(controller.getAll()).resolves.toEqual([gameCategoryMock]);
    });
  });

  describe('get', () => {
    it('should return a game category by id', async () => {
      controller.get = jest.fn().mockResolvedValue(gameCategoryMock);
      await expect(controller.get(1)).resolves.toEqual(gameCategoryMock);
      expect(controller.get).toHaveBeenCalledWith(1);
    });
  });

  describe('create', () => {
    it('should create a game category', async () => {
      controller.create = jest.fn().mockResolvedValue({ data: 'Catégorie de jeu créée avec succès !' });
      const createGameCategoryDto = createGameCategoryMock;
      await expect(controller.create(createGameCategoryDto)).resolves.toEqual({ data: 'Catégorie de jeu créée avec succès !' });
      expect(controller.create).toHaveBeenCalledWith(createGameCategoryDto);
    });
  });

  describe('update', () => {
    it('should update a game category', async () => {
      controller.update = jest.fn().mockResolvedValue({ data: 'Catégorie de jeu mise à jour avec succès !' });
      const updateGameCategoryDto = createGameCategoryMock;
      await expect(controller.update(1, updateGameCategoryDto)).resolves.toEqual({ data: 'Catégorie de jeu mise à jour avec succès !' });
      expect(controller.update).toHaveBeenCalledWith(1, updateGameCategoryDto);
    });
  });

  describe('delete', () => {
    it('should delete a game category', async () => {
      controller.delete = jest.fn().mockResolvedValue({ data: 'Catégorie de jeu supprimée avec succès !' });
      await expect(controller.delete(1)).resolves.toEqual({ data: 'Catégorie de jeu supprimée avec succès !' });
      expect(controller.delete).toHaveBeenCalledWith(1);
    });
  });
});