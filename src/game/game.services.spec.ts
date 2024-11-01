import { Test, TestingModule } from '@nestjs/testing';
import { GameService } from './game.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { createGameMock, gameMock } from './mocks/game.mock';

describe('GameService', () => {
  let service: GameService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GameService,
        {
          provide: PrismaService,
          useValue: {
            game: {
              findMany: jest.fn().mockResolvedValue([gameMock]),
              findUnique: jest.fn().mockResolvedValue(gameMock),
              create: jest.fn().mockResolvedValue(gameMock),
              update: jest.fn().mockResolvedValue(gameMock),
              delete: jest.fn().mockResolvedValue(gameMock),
            },
            gameEditor: {
              findUnique: jest.fn().mockResolvedValue({ id_editor: 1, name: 'Editor Name' }),
            },
            gameCategory: {
              findUnique: jest.fn().mockResolvedValue({ id_category: 1, name: 'Board Games' }),
            },
          },
        },
      ],
    }).compile();

    service = module.get<GameService>(GameService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('getAll', () => {
    it('should return an array of games', async () => {
      const result = await service.getAll();
      expect(result).toEqual([gameMock]);
      expect(prismaService.game.findMany).toHaveBeenCalled();
    });
  });

  describe('get', () => {
    it('should return a game by id', async () => {
      const result = await service.get(1);
      expect(result).toEqual(gameMock);
      expect(prismaService.game.findUnique).toHaveBeenCalledWith({ where: { id_game: 1 } });
    });

    it('should throw NotFoundException if game not found', async () => {
      jest.spyOn(prismaService.game, 'findUnique').mockResolvedValue(null);
      await expect(service.get(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a game', async () => {
      jest.spyOn(prismaService.game, 'findUnique').mockResolvedValue(null);
      const createGameDto = createGameMock;
      const result = await service.create(createGameDto);
      expect(result).toEqual({data: 'Jeu créé avec succès !'});
      expect(prismaService.game.create).toHaveBeenCalledWith({
        data: createGameDto,
      });
    });

    it('should throw ConflictException if game already exists', async () => {
      jest.spyOn(prismaService.game, 'findUnique').mockResolvedValue(gameMock);
      const createGameMockDto = createGameMock;
      await expect(service.create(createGameMockDto)).rejects.toThrow(ConflictException);
    });
  });

  describe('update', () => {
    it('should update a game', async () => {
      const updateGameMockDto = createGameMock;
      const result = await service.update(1, updateGameMockDto);
      expect(result).toEqual({data: 'Jeu modifié avec succès !'});
      expect(prismaService.game.update).toHaveBeenCalledWith({
        where: { id_game: 1 },
        data: updateGameMockDto,
      });
    });

    it('should throw NotFoundException if game not found', async () => {
      jest.spyOn(prismaService.game, 'findUnique').mockResolvedValue(null);
      const updateGameMockDto = createGameMock;
      await expect(service.update(1, updateGameMockDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('should delete a game', async () => {
      const result = await service.delete(1);
      expect(result).toEqual({data: 'Jeu supprimé avec succès !'});
      expect(prismaService.game.delete).toHaveBeenCalledWith({ where: { id_game: 1 } });
    });

    it('should throw NotFoundException if game not found', async () => {
      jest.spyOn(prismaService.game, 'findUnique').mockResolvedValue(null);
      await expect(service.delete(1)).rejects.toThrow(NotFoundException);
    });
  });
});