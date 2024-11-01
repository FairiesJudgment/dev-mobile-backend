import { Test, TestingModule } from "@nestjs/testing";
import { DepositedGameController } from "./deposited-game.controller";
import { ManagerServiceMock } from "src/manager/mocks/manager.services.mock";
import { ConfigService } from "@nestjs/config";
import { ManagerService } from "src/manager/manager.service";
import { ManagerGuard } from "src/common/guards/manager.guard";
import { JwtService } from "@nestjs/jwt";
import { DepositedGameService } from "./deposited-game.service";
import { depositedGameMock } from "./mocks/deposited-game.mock";

describe('DepositedGameController', () => {
  let controller: DepositedGameController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DepositedGameController],
      providers: [{provide: DepositedGameService, useClass: jest.fn()},
                  {provide: ManagerService, useClass: ManagerServiceMock},
                  {provide: ManagerGuard, useValue: {canActivate: jest.fn().mockReturnValue(true),},},
                  {provide: JwtService, useValue: {sign: jest.fn(), verify: jest.fn()},},
                  {provide: ConfigService, useValue: {get: jest.fn(),},},
      ],
    }).compile();
    controller = module.get<DepositedGameController>(DepositedGameController)
  });

  describe("getAll", ()=> {
    it("should return an array of despositedGame", () => {
      controller.getAll = jest.fn().mockResolvedValue([depositedGameMock]);
      expect(controller.getAll()).resolves.toEqual([depositedGameMock])
    })
  })

  describe('get', () => {
    it('should return a deposited game by tag', async () => {
      controller.get = jest.fn().mockResolvedValue(depositedGameMock);
      await expect(controller.get('tag')).resolves.toEqual(depositedGameMock);
      expect(controller.get).toHaveBeenCalledWith('tag');
    });
  });

  describe('getByGame', () => {
    it('should return deposited games by game ID', async () => {
      controller.getByGame = jest.fn().mockResolvedValue(depositedGameMock);
      await expect(controller.getByGame(1)).resolves.toEqual(depositedGameMock);
      expect(controller.getByGame).toHaveBeenCalledWith(1);
    });
  });

  describe('getBySession', () => {
    it('should return deposited games by session ID', async () => {
      controller.getBySession = jest.fn().mockResolvedValue(depositedGameMock);
      await expect(controller.getBySession(1)).resolves.toEqual(depositedGameMock);
      expect(controller.getBySession).toHaveBeenCalledWith(1);
    });
  });

  describe('getBySeller', () => {
    it('should return deposited games by seller ID', async () => {
      controller.getBySeller = jest.fn().mockResolvedValue(depositedGameMock);
      await expect(controller.getBySeller('123e4567-e89b-12d3-a456-426614174000')).resolves.toEqual(depositedGameMock);
      expect(controller.getBySeller).toHaveBeenCalledWith('123e4567-e89b-12d3-a456-426614174000');
    });
  });

  describe('create', () => {
    it('should create a deposited game', async () => {
      controller.create = jest.fn().mockResolvedValue({ data: 'Jeu déposé créé avec succès !' });
      const createDepositedGameDto = {
        price: 19.99,
        sold: false,
        for_sale: true,
        id_session: 1,
        id_seller: '123e4567-e89b-12d3-a456-426614174000',
        id_game: 1,
      };
      await expect(controller.create(createDepositedGameDto)).resolves.toEqual({ data: 'Jeu déposé créé avec succès !' });
      expect(controller.create).toHaveBeenCalledWith(createDepositedGameDto);
    });
  });

  describe('update', () => {
    it('should update a deposited game', async () => {
      controller.update = jest.fn().mockResolvedValue({ data: 'Jeu déposé mis à jour avec succès !' });
      const updateDepositedGameDto = {
        price: 19.99,
        sold: false,
        for_sale: true,
        id_session: 1,
        id_seller: '123e4567-e89b-12d3-a456-426614174000',
        id_game: 1,
      };
      await expect(controller.update('tag', updateDepositedGameDto)).resolves.toEqual({ data: 'Jeu déposé mis à jour avec succès !' });
      expect(controller.update).toHaveBeenCalledWith('tag', updateDepositedGameDto);
    });
  });

  describe('delete', () => {
    it('should delete a deposited game', async () => {
      controller.delete = jest.fn().mockResolvedValue({ data: 'Jeu déposé supprimé avec succès !' });
      await expect(controller.delete('tag')).resolves.toEqual({ data: 'Jeu déposé supprimé avec succès !' });
      expect(controller.delete).toHaveBeenCalledWith('tag');
    });
  });
});