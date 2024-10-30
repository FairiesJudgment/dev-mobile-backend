import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateGameCategoryDto } from './dto/createGameCategoryDto';
import { UpdateGameCategoryDto } from './dto/updateGameCategoryDto';

@Injectable()
export class GameCategoryService {

    constructor(private readonly prismaService: PrismaService) {}

    // récupérer toutes les catégories de jeux
    async getAll() {
        return await this.prismaService.gameCategory.findMany();
    }

    // récupérer une catégorie de jeu selon son id
    async get(id_category: number) {
        // Vérifier si la catégorie existe
        const gameCategory = await this.prismaService.gameCategory.findUnique({where: { id_category: Number(id_category) },});
        if (!gameCategory) { throw new NotFoundException("Cette catégorie de jeu n'existe pas.");}
        // Retourner les infos de la catégorie
        return gameCategory;
    }

    // créer une catégorie de jeu
    async create(createGameCategoryDto: CreateGameCategoryDto) {
        const { name, description } = createGameCategoryDto;

        // enregistrer la catégorie en BD
        await this.prismaService.gameCategory.create({
            data: {
                name,
                description
            }
        });
        // retourner message de succès
        return { data: 'Catégorie de jeu créée avec succès !' };
    }

    // modifier une catégorie de jeu
    async update(id_category: number, updateGameCategoryDto: UpdateGameCategoryDto) {
        const { name, description } = updateGameCategoryDto;

        // vérifier si la catégorie existe
        const gameCategory = await this.prismaService.gameCategory.findUnique({where: { id_category: Number(id_category) }});
        if (!gameCategory) { throw new NotFoundException("Cette catégorie de jeu n'existe pas.");}

        // modifier la catégorie en BD
        await this.prismaService.gameCategory.update({
            where: { id_category: Number(id_category) },
            data: {
                name,
                description
            }
        });
        // retourner message de succès
        return { data: 'Catégorie de jeu modifiée avec succès !' };
    }

    // supprimer une catégorie de jeu
    async delete(id_category: number) {
        // vérifier si la catégorie existe
        const gameCategory = await this.prismaService.gameCategory.findUnique({where: { id_category: Number(id_category) }});
        if (!gameCategory) { throw new NotFoundException("Cette catégorie de jeu n'existe pas.");}

        // supprimer la catégorie en BD
        await this.prismaService.gameCategory.delete({where: { id_category: Number(id_category) }});
        // retourner message de succès
        return { data: 'Catégorie de jeu supprimée avec succès !' };
    }
}
