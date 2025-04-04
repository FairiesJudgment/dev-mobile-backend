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
        const game = await this.prismaService.game.findUnique({where: { id_game },});
        if (!game) { throw new NotFoundException("Ce jeu n'existe pas.");}
        // Retourner les infos du jeu
        return game;
    }

    // récupérer un jeu selon son nom
    async getByName(name: string) {
        // Vérifier si le jeu existe
        const game = await this.prismaService.game.findUnique({where: { name },});
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
            image,
            id_category 
        } = createGameDto;

        // verifier si les joueurs et l'âge sont positifs
        if (min_players < 0 || max_players < 0 || min_age < 0 || max_age < 0) { throw new ConflictException("Les nombres de joueurs et l'âge doivent être positifs.");}

        // verifier si min_players est inférieur ou égal à max_players
        if (min_players > max_players) { throw new ConflictException("Le nombre de joueurs minimum doit être inférieur ou égal au nombre de joueurs maximum.");}

        // verifier si min_age est inférieur ou égal à max_age
        if (min_age > max_age) { throw new ConflictException("L'âge minimum doit être inférieur ou égal à l'âge maximum.");}

        // vérifier si le jeu existe déjà
        const game = await this.prismaService.game.findUnique({where: { name },});
        if (game) { throw new ConflictException("Ce jeu existe déjà.");}

        // Vérifier si l'éditeur existe
        const editor = await this.prismaService.gameEditor.findUnique({where: { id_editor },});
        if (!editor) { throw new NotFoundException("Cet éditeur de jeu n'existe pas.");}

        // Vérifier si la catégorie existe
        const category = await this.prismaService.gameCategory.findUnique({where: { id_category },});
        if (!category) { throw new NotFoundException("Cette catégorie de jeu n'existe pas.");}
        
        // enregistrer le jeu en BD
        await this.prismaService.game.create({
            data: {
                name,
                description,
                min_players,
                max_players,
                min_age,
                max_age,
                image,
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
            image,
            min_players,
            max_players,
            min_age,
            max_age,
            id_editor,
            id_category 
        } = updateGameDto;

        // vérifier si les joueurs et l'âge sont positifs
        if (min_players < 0 || max_players < 0 || min_age < 0 || max_age < 0) { throw new ConflictException("Les nombres de joueurs et l'âge doivent être positifs.");}

        // vérifier si min_players est inférieur ou égal à max_players
        if (min_players > max_players) { throw new ConflictException("Le nombre de joueurs minimum doit être inférieur ou égal au nombre de joueurs maximum.");}

        // vérifier si min_age est inférieur ou égal à max_age
        if (min_age > max_age) { throw new ConflictException("L'âge minimum doit être inférieur ou égal à l'âge maximum.");}

        // vérifier si le jeu existe
        const game = await this.prismaService.game.findUnique({where: { id_game },});
        if (!game) { throw new NotFoundException("Ce jeu n'existe pas.");}


        // vérifier si l'éditeur existe
        if (id_editor) {    
            const editor = await this.prismaService.gameEditor.findUnique({where: { id_editor },});
            if (!editor) { throw new NotFoundException("Cet éditeur de jeu n'existe pas.");}
        }

        // vérifier si la catégorie existe
        if (id_category) {
            const category = await this.prismaService.gameCategory.findUnique({where: { id_category },});
            if (!category) { throw new NotFoundException("Cette catégorie de jeu n'existe pas.");}
        }
        
        // vérifier si le nom n'est pas déjà utilisé
        if (name) {
            const nameExist = await this.prismaService.game.findUnique({where: { name },});
            if (nameExist && nameExist.id_game !== id_game) { throw new ConflictException("Ce nom de jeu existe déjà.");}
        }
        
        // modifier le jeu en BD
        await this.prismaService.game.update({ where: { id_game },
            data: {
                name,
                description,
                image,
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
        const game = await this.prismaService.game.findUnique({where: { id_game },});
        if (!game) { throw new NotFoundException("Ce jeu n'existe pas.");}

        // supprimer le jeu en BD
        await this.prismaService.game.delete({where: { id_game },});
        // retourner message de succès
        return { data: 'Jeu supprimé avec succès !' };
    }

    // supprimer plusieurs jeux
    async deleteMany(ids: number[]) {
        // verifier que ids est fourni
        if (ids == undefined) { throw new NotFoundException("Vous devez fournir une liste d'ids de jeux.");}
        // vérifier si les jeux existent
        for (let id of ids) {
            const game = await this.prismaService.game.findUnique({where: { id_game: id },});
            if (!game) { throw new NotFoundException("Le jeu avec l'id " + id + " n'existe pas.");}
        }
        // supprimer les jeux en BD
        await this.prismaService.game.deleteMany({where: { id_game: { in: ids }},});
        // retourner message de succès
        return { data: 'Jeux supprimés avec succès !' };
    }
}
