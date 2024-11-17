import { Test, TestingModule } from "@nestjs/testing";
import { DepositedGameController } from "./deposited-game.controller";
import { ManagerServiceMock } from "src/manager/mocks/manager.service.mock";
import { ConfigService } from "@nestjs/config";
import { ManagerService } from "src/manager/manager.service";
import { ManagerGuard } from "src/common/guards/manager.guard";
import { JwtService } from "@nestjs/jwt";
import { DepositedGameService } from "./deposited-game.service";
import { manyDepositedGamesMock, createManyDepositedGamesMock } from "./mocks/deposited-game.mock";

describe('DepositedGameController', () => {
  let controller: DepositedGameController;
  let service: DepositedGameService;

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
    controller = module.get<DepositedGameController>(DepositedGameController),
    service = module.get<DepositedGameService>(DepositedGameService);
  });

  describe("getAll", ()=> {
    it("should return an array of despositedGame", () => {
      controller.getAll = jest.fn().mockResolvedValue([manyDepositedGamesMock]);
      expect(controller.getAll()).resolves.toEqual([manyDepositedGamesMock])
    })
  })

  describe('get', () => {
    it('should return a deposited game by tag', async () => {
      controller.get = jest.fn().mockResolvedValue(manyDepositedGamesMock);
      await expect(controller.get('tag')).resolves.toEqual(manyDepositedGamesMock);
      expect(controller.get).toHaveBeenCalledWith('tag');
    });
  });

  describe('getByGame', () => {
    it('should return deposited games by game ID', async () => {
      controller.getByGame = jest.fn().mockResolvedValue(manyDepositedGamesMock);
      await expect(controller.getByGame(1)).resolves.toEqual(manyDepositedGamesMock);
      expect(controller.getByGame).toHaveBeenCalledWith(1);
    });
  });

  describe('getBySession', () => {
    it('should return deposited games by session ID', async () => {
      controller.getBySession = jest.fn().mockResolvedValue(manyDepositedGamesMock);
      await expect(controller.getBySession(1)).resolves.toEqual(manyDepositedGamesMock);
      expect(controller.getBySession).toHaveBeenCalledWith(1);
    });
  });

  describe('getBySeller', () => {
    it('should return deposited games by seller ID', async () => {
      controller.getBySeller = jest.fn().mockResolvedValue(manyDepositedGamesMock);
      await expect(controller.getBySeller('123e4567-e89b-12d3-a456-426614174000')).resolves.toEqual(manyDepositedGamesMock);
      expect(controller.getBySeller).toHaveBeenCalledWith('123e4567-e89b-12d3-a456-426614174000');
    });
  });

  describe('createMany', () => {
    it('should create deposited games', async () => {
      const createManyDepositedGameDto = createManyDepositedGamesMock;
      controller.createMany = jest.fn().mockResolvedValue({ data: 'Jeux déposés créés avec succès !' });
      const result = await controller.createMany(createManyDepositedGameDto);
      expect(result).toEqual({ data: 'Jeux déposés créés avec succès !' });
    });
  });

  describe('update', () => {
    it('should update a deposited game', async () => {
      controller.update = jest.fn().mockResolvedValue({ data: 'Jeu déposé mis à jour avec succès !' });
      const manyDepositedGamesMockDto = manyDepositedGamesMock
      await expect(controller.update('tag', manyDepositedGamesMockDto)).resolves.toEqual({ data: 'Jeu déposé mis à jour avec succès !' });
      expect(controller.update).toHaveBeenCalledWith('tag', manyDepositedGamesMockDto);
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