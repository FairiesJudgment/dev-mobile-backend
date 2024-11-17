import { Test, TestingModule } from '@nestjs/testing';
import { DepositedGameService } from './deposited-game.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { manyDepositedGamesMock, createManyDepositedGamesMock, updateDepositedGamesMock } from './mocks/deposited-game.mock';
import { SessionService } from 'src/session/session.service';

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
              findMany: jest.fn().mockResolvedValue([manyDepositedGamesMock]),
              findUnique: jest.fn().mockResolvedValue(manyDepositedGamesMock),
              create: jest.fn().mockResolvedValue(manyDepositedGamesMock),
              updateMany: jest.fn().mockResolvedValue(manyDepositedGamesMock),
              delete: jest.fn().mockResolvedValue(manyDepositedGamesMock),
            },
            game: {
              findUnique: jest.fn().mockResolvedValue(manyDepositedGamesMock),
            },
            session: {
              findUnique: jest.fn().mockResolvedValue(manyDepositedGamesMock),
            },
            seller: {
              findUnique: jest.fn().mockResolvedValue(manyDepositedGamesMock),
            },
          },
        },
        {
          provide: SessionService,
          useValue: {
            getOpened: jest.fn().mockResolvedValue({ manyDepositedGamesMock}),
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
      expect(result).toEqual([manyDepositedGamesMock]);
      expect(prismaService.depositedGame.findMany).toHaveBeenCalled();
    });
  });

  describe('get', () => {
    it('should return a deposited game by tag', async () => {
      const result = await service.get('tag');
      expect(result).toEqual(manyDepositedGamesMock);
      expect(prismaService.depositedGame.findUnique).toHaveBeenCalledWith({ where: { tag: 'tag' } });
    });

    it('should throw NotFoundException if deposited game not found', async () => {
      jest.spyOn(prismaService.depositedGame, 'findUnique').mockResolvedValue(null);
      await expect(service.get('tag')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a deposited game', async () => {
      const createManyDepositedGamesMockDto = createManyDepositedGamesMock
      const result = await service.createMany(createManyDepositedGamesMockDto);
      expect(result).toEqual({data: 'Jeux déposés créés avec succès !'});
    });
  });

  describe('update', () => {
    it('should update a deposited game', async () => {
      const updateDepositedGamesMockDto = updateDepositedGamesMock;
      const result = await service.update('tag1', updateDepositedGamesMockDto);
      expect(result).toEqual({data: 'Jeux déposés mis à jour avec succès !'});
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
    await expect(service.createMany({ ...manyDepositedGamesMock, price: manyDepositedGamesMock.price })).rejects.toThrow(NotFoundException);
  });
});