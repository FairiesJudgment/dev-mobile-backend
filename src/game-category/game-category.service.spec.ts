import { Test, TestingModule } from '@nestjs/testing';
import { GameCategoryService } from './game-category.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { gameCategoryMock, createGameCategoryMock } from './mocks/game-category.mock';

describe('GameCategoryService', () => {
  let service: GameCategoryService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GameCategoryService,
        {
          provide: PrismaService,
          useValue: {
            gameCategory: {
              findMany: jest.fn().mockResolvedValue([gameCategoryMock]),
              findUnique: jest.fn().mockResolvedValue(gameCategoryMock),
              create: jest.fn().mockResolvedValue(gameCategoryMock),
              update: jest.fn().mockResolvedValue(gameCategoryMock),
              delete: jest.fn().mockResolvedValue(gameCategoryMock),
            },
          },
        },
      ],
    }).compile();

    service = module.get<GameCategoryService>(GameCategoryService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAll', () => {
    it('should return an array of game categories', async () => {
      const result = await service.getAll();
      expect(result).toEqual([gameCategoryMock]);
      expect(prismaService.gameCategory.findMany).toHaveBeenCalled();
    });
  });

  describe('get', () => {
    it('should return a game category by id', async () => {
      const result = await service.get(1);
      expect(result).toEqual(gameCategoryMock);
      expect(prismaService.gameCategory.findUnique).toHaveBeenCalledWith({ where: { id_category: 1 } });
    });

    it('should throw NotFoundException if game category not found', async () => {
      jest.spyOn(prismaService.gameCategory, 'findUnique').mockResolvedValue(null);
      await expect(service.get(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a game category', async () => {
      jest.spyOn(prismaService.gameCategory, 'findUnique').mockResolvedValue(null);
      const createGameCategoryDto = createGameCategoryMock;
      const result = await service.create(createGameCategoryDto);
      expect(result).toEqual({data: 'Catégorie de jeu créée avec succès !'});
      expect(prismaService.gameCategory.create).toHaveBeenCalledWith({
        data: createGameCategoryDto,
      });
    });

    it('should throw ConflictException if game category already exists', async () => {
      jest.spyOn(prismaService.gameCategory, 'findUnique').mockResolvedValue(gameCategoryMock);
      const createGameCategoryDto = createGameCategoryMock;
      await expect(service.create(createGameCategoryDto)).rejects.toThrow(ConflictException);
    });
  });

  describe('update', () => {
    it('should update a game category', async () => {
      const updateGameCategoryDto = createGameCategoryMock;
      jest.spyOn(prismaService.gameCategory, 'findUnique').mockResolvedValueOnce(gameCategoryMock); // Mock existing category
      jest.spyOn(prismaService.gameCategory, 'findUnique').mockResolvedValueOnce(null); // Mock no conflict on name
      const result = await service.update(1, updateGameCategoryDto);
      expect(result).toEqual({ data: 'Catégorie de jeu modifiée avec succès !' });
      expect(prismaService.gameCategory.update).toHaveBeenCalledWith({
      where: { id_category: 1 },
      data: updateGameCategoryDto,
    });
  });

    it('should throw NotFoundException if game category not found', async () => {
      jest.spyOn(prismaService.gameCategory, 'findUnique').mockResolvedValue(null);
      const updateGameCategoryDto = createGameCategoryMock;
      await expect(service.update(1, updateGameCategoryDto)).rejects.toThrow(NotFoundException);
    });
    it('should throw ConflictException if game category name already exists', async () => {
      jest.spyOn(prismaService.gameCategory, 'findUnique').mockResolvedValue({ id_category: 2, name: 'Existing Category', description: 'Description' });
      const updateGameCategoryDto = { ...createGameCategoryMock, name: 'Existing Category' };
      await expect(service.update(1, updateGameCategoryDto)).rejects.toThrow(ConflictException);
    });
  });

  describe('delete', () => {
    it('should delete a game category', async () => {
      const result = await service.delete(1);
      expect(result).toEqual({data: 'Catégorie de jeu supprimée avec succès !'});
      expect(prismaService.gameCategory.delete).toHaveBeenCalledWith({ where: { id_category: 1 } });
    });

    it('should throw NotFoundException if game category not found', async () => {
      jest.spyOn(prismaService.gameCategory, 'findUnique').mockResolvedValue(null);
      await expect(service.delete(1)).rejects.toThrow(NotFoundException);
    });
  });
});