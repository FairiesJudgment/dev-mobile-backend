import { Test, TestingModule } from '@nestjs/testing';
import { DepositedGameService } from './deposited-game.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { depositedGameMock } from './mocks/deposited-game.mock';
import { Decimal } from '@prisma/client/runtime/library';

describe('DepositedGameService', () => {
  let service: DepositedGameService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DepositedGameService,
        {
          provide: PrismaService,
          useValue: {
            depositedGame: {
              findMany: jest.fn().mockResolvedValue([depositedGameMock]),
              findUnique: jest.fn().mockResolvedValue(depositedGameMock),
              create: jest.fn().mockResolvedValue(depositedGameMock),
              update: jest.fn().mockResolvedValue(depositedGameMock),
              delete: jest.fn().mockResolvedValue(depositedGameMock),
            },
            game: {
              findUnique: jest.fn().mockResolvedValue(depositedGameMock),
            },
            session: {
              findUnique: jest.fn().mockResolvedValue(depositedGameMock),
            },
            seller: {
              findUnique: jest.fn().mockResolvedValue(depositedGameMock),
            },
          },
        },
      ],
    }).compile();

    service = module.get<DepositedGameService>(DepositedGameService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAll', () => {
    it('should return an array of deposited games', async () => {
      const result = await service.getAll();
      expect(result).toEqual([depositedGameMock]);
      expect(prismaService.depositedGame.findMany).toHaveBeenCalled();
    });
  });

  describe('get', () => {
    it('should return a deposited game by tag', async () => {
      const result = await service.get('tag');
      expect(result).toEqual(depositedGameMock);
      expect(prismaService.depositedGame.findUnique).toHaveBeenCalledWith({ where: { tag: 'tag' } });
    });

    it('should throw NotFoundException if deposited game not found', async () => {
      jest.spyOn(prismaService.depositedGame, 'findUnique').mockResolvedValue(null);
      await expect(service.get('tag')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a deposited game', async () => {
      const createDepositedGameDto = {
        price: 19.99,
        sold: false,
        for_sale: true,
        id_session: 1,
        id_seller: '123e4567-e89b-12d3-a456-426614174000',
        id_game: 1,
      };
      const result = await service.create(createDepositedGameDto);
      expect(result).toEqual({data: 'Jeu déposé créé avec succès !'});
      expect(prismaService.depositedGame.create).toHaveBeenCalledWith({
        data: createDepositedGameDto,
      });
    });
  });

  describe('update', () => {
    it('should update a deposited game', async () => {
      const updateDepositedGameDto = {
        price: 29.99,
        sold: false,
        for_sale: true,
        id_session: 1,
        id_seller: '123e4567-e89b-12d3-a456-426614174000',
        id_game: 1,
      };
      const result = await service.update('tag1', updateDepositedGameDto);
      expect(result).toEqual({data: 'Jeu déposé mis à jour avec succès !'});
      expect(prismaService.depositedGame.update).toHaveBeenCalledWith({
        where: { tag: 'tag1' },
        data: updateDepositedGameDto,
      });
    });
  });

  describe('delete', () => {
    it('should delete a deposited game', async () => {
      const result = await service.delete('tag');
      expect(result).toEqual({data: 'Jeu déposé supprimé avec succès !'});
      expect(prismaService.depositedGame.delete).toHaveBeenCalledWith({ where: { tag: 'tag' } });
    });
  });

  // Additional tests for NotFoundExceptions
  it('should throw NotFoundException if the game does not exist when creating', async () => {
    jest.spyOn(prismaService.game, 'findUnique').mockResolvedValue(null); // Mock to return null for game
    await expect(service.create({ ...depositedGameMock, price: depositedGameMock.price.toNumber() })).rejects.toThrow(NotFoundException);
  });
});