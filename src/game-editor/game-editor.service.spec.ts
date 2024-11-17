import { Test, TestingModule } from '@nestjs/testing';
import { GameEditorService } from './game-editor.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { gameEditorMock, createGameEditorMock } from './mocks/game-editor.mock';

describe('GameEditorService', () => {
  let service: GameEditorService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GameEditorService,
        {
          provide: PrismaService,
          useValue: {
            gameEditor: {
              findMany: jest.fn().mockResolvedValue([gameEditorMock]),
              findUnique: jest.fn().mockResolvedValue(gameEditorMock),
              create: jest.fn().mockResolvedValue(gameEditorMock),
              update: jest.fn().mockResolvedValue(gameEditorMock),
              delete: jest.fn().mockResolvedValue(gameEditorMock),
            },
          },
        },
      ],
    }).compile();

    service = module.get<GameEditorService>(GameEditorService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAll', () => {
    it('should return an array of game editors', async () => {
      const result = await service.getAll();
      expect(result).toEqual([gameEditorMock]);
      expect(prismaService.gameEditor.findMany).toHaveBeenCalled();
    });
  });

  describe('get', () => {
    it('should return a game editor by id', async () => {
      const result = await service.get(1);
      expect(result).toEqual(gameEditorMock);
      expect(prismaService.gameEditor.findUnique).toHaveBeenCalledWith({ where: { id_editor: 1 } });
    });

    it('should throw NotFoundException if game editor not found', async () => {
      jest.spyOn(prismaService.gameEditor, 'findUnique').mockResolvedValue(null);
      await expect(service.get(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a game editor', async () => {
      jest.spyOn(prismaService.gameEditor, 'findUnique').mockResolvedValue(null);
      const createGameEditorDto = createGameEditorMock;
      const result = await service.create(createGameEditorDto);
      expect(result).toEqual({data: 'Éditeur de jeu créé avec succès !'});
      expect(prismaService.gameEditor.create).toHaveBeenCalledWith({
        data: createGameEditorDto,
      });
    });

    it('should throw ConflictException if game editor already exists', async () => {
      jest.spyOn(prismaService.gameEditor, 'findUnique').mockResolvedValue(gameEditorMock);
      const createGameEditorDto = createGameEditorMock;
      await expect(service.create(createGameEditorDto)).rejects.toThrow(ConflictException);
    });
  });

  describe('update', () => {
    it('should update a game editor', async () => {
      const updateGameEditorDto = createGameEditorMock;
      jest.spyOn(prismaService.gameEditor, 'findUnique')
        .mockResolvedValueOnce(gameEditorMock) // Mock existing editor
        .mockResolvedValueOnce(null); // Mock no conflict on name
      const result = await service.update(1, updateGameEditorDto);
      expect(result).toEqual({data: 'Éditeur de jeu modifié avec succès !'});
      expect(prismaService.gameEditor.update).toHaveBeenCalledWith({
        where: { id_editor: 1 },
        data: updateGameEditorDto,
      });
    });

    it('should throw NotFoundException if game editor not found', async () => {
      jest.spyOn(prismaService.gameEditor, 'findUnique').mockResolvedValue(null);
      const updateGameEditorDto = createGameEditorMock;
      await expect(service.update(1, updateGameEditorDto)).rejects.toThrow(NotFoundException);
    });

    it('should throw ConflictException if game editor already exists', async () => {
      jest.spyOn(prismaService.gameEditor, 'findUnique').mockResolvedValue(gameEditorMock);
      const updateGameEditorDto = createGameEditorMock;
      await expect(service.update(1, updateGameEditorDto)).rejects.toThrow(ConflictException);
    });
  });

  describe('delete', () => {
    it('should delete a game editor', async () => {
      const result = await service.delete(1);
      expect(result).toEqual({data: 'Éditeur de jeu supprimé avec succès !'});
      expect(prismaService.gameEditor.delete).toHaveBeenCalledWith({ where: { id_editor: 1 } });
    });

    it('should throw NotFoundException if game editor not found', async () => {
      jest.spyOn(prismaService.gameEditor, 'findUnique').mockResolvedValue(null);
      await expect(service.delete(1)).rejects.toThrow(NotFoundException);
    });
  });
});