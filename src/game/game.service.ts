import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateGameDto } from './dto/createGameDto';
import { UpdateGameDto } from './dto/updateGameDto';

@Injectable()
export class GameService {
    
    constructor(private readonly prismaService: PrismaService) {}

    // récupérer tous les jeux
    async getAll() {
        return await this.prismaService.game.findMany();
    }

    // récupérer un jeu selon son id
    async get(id_game: number) {
        // Vérifier si le jeu existe
        const game = await this.prismaService.game.findUnique({where: { id_game: Number(id_game) },});
        if (!game) { throw new NotFoundException("Ce jeu n'existe pas.");}
        // Retourner les infos du jeu
        return game;
    }

    // créer un jeu
    async create(createGameDto: CreateGameDto) {

        const {
            name,
            description,
            min_players,
            max_players,
            min_age,
            max_age,
            id_editor,
            id_category 
        } = createGameDto;

        // Vérifier si l'éditeur existe
        const editor = await this.prismaService.gameEditor.findUnique({where: { id_editor },});
        if (!editor) { throw new NotFoundException("Cet éditeur de jeu n'existe pas.");}

        // Vérifier si la catégorie existe
        const category = await this.prismaService.gameCategory.findUnique({where: { id_category },});
        if (!category) { throw new NotFoundException("Cette catégorie de jeu n'existe pas.");}

        // vérifier si le jeu existe déjà
        const game = await this.prismaService.game.findUnique({where: { name },});
        if (game) { throw new ConflictException("Ce jeu existe déjà.");}
        
        // enregistrer le jeu en BD
        await this.prismaService.game.create({
            data: {
                name,
                description,
                min_players,
                max_players,
                min_age,
                max_age,
                id_editor : id_editor,
                id_category : id_category
            }
        });
        // retourner message de succès
        return { data: 'Jeu créé avec succès !' };
    }

    // modifier un jeu
    async update(id_game: number, updateGameDto: UpdateGameDto) {
        const {
            name,
            description,
            min_players,
            max_players,
            min_age,
            max_age,
            id_editor,
            id_category 
        } = updateGameDto;

        // vérifier si le jeu existe
        const game = await this.prismaService.game.findUnique({where: { id_game: Number(id_game) },});
        if (!game) { throw new NotFoundException("Ce jeu n'existe pas.");}

        // modifier le jeu en BD
        await this.prismaService.game.update({ where: { id_game: Number(id_game) },
            data: {
                name,
                description,
                min_players,
                max_players,
                min_age,
                max_age,
                id_editor : id_editor,
                id_category : id_category
            }
        });
        // retourner message de succès
        return { data: 'Jeu modifié avec succès !' };
    }

    // supprimer un jeu
    async delete(id_game: number) {
        // vérifier si le jeu existe
        const game = await this.prismaService.game.findUnique({where: { id_game: Number(id_game) },});
        if (!game) { throw new NotFoundException("Ce jeu n'existe pas.");}

        // supprimer le jeu en BD
        await this.prismaService.game.delete({where: { id_game: Number(id_game) },});
        // retourner message de succès
        return { data: 'Jeu supprimé !' };
    }
}
