import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateGameDto } from './dto/createGameDto';

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
        const game = await this.prismaService.game.findUnique({where: { id_game: id_game }});
        if (!game) { throw new NotFoundException("Ce jeu n'existe pas.");}
        // Retourner les infos du jeu
        return { 
            data: {
                name: game.name,
                description: game.description,
                min_players: game.min_players,
                max_players: game.max_players,
                min_age: game.min_age,
                max_age: game.max_age,
                id_editor: game.id_editor,
                id_category: game.id_category
            }
        };
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

        // vérifier si le jeu existe déjà
        // const game = await this.prismaService.game.findGame({where: { name: name }});
        // if (game) { throw new ConflictException("Ce jeu existe déjà.");}
        
        // enregistrer le jeu en BD
        await this.prismaService.game.create({
            data: {
                name,
                description,
                min_players,
                max_players,
                min_age,
                max_age,
                id_editor : Number(id_editor),
                id_category : Number(id_category)
            }
        });
        // retourner message de succès
        return { data: 'Jeu créé avec succès !' };
    }
}
