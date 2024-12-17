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
        // Verifier si id_category est défini
        if (!id_category) { throw new NotFoundException("Vous devez fournir l'identifiant de la catégorie.");}
        // Vérifier si la catégorie existe
        const gameCategory = await this.prismaService.gameCategory.findUnique({where: { id_category: Number(id_category) },});
        if (!gameCategory) { throw new NotFoundException("Cette catégorie de jeu n'existe pas.");}
        // Retourner les infos de la catégorie
        return gameCategory;
    }

    // créer une catégorie de jeu
    async create(createGameCategoryDto: CreateGameCategoryDto) {
        const { name, description } = createGameCategoryDto;

        // vérifier si la catégorie existe déjà
        const gameCategory = await this.prismaService.gameCategory.findUnique({where: { name },});
        if (gameCategory) { throw new ConflictException("Cette catégorie de jeu existe déjà.");}

        // vérifier si le nom de la catégorie n'existe pas déjà
        const gameCategoryName = await this.prismaService.gameCategory.findUnique({where: { name },});
        if (gameCategoryName) { throw new ConflictException("Ce nom de catégorie existe déjà.");}

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

        // vérifier si le nom de la catégorie n'existe pas déjà
        if (name) {
            const gameCategoryName = await this.prismaService.gameCategory.findUnique({where: { name },});
            if (gameCategoryName) { throw new ConflictException("Ce nom de catégorie existe déjà.");}
        }

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

    // supprimer plusieurs catégories de jeux
    async deleteMany(ids: number[]) {
        // vérifier que ids est fourni
        if (ids == undefined) { throw new NotFoundException("Vous devez fournir une liste d'ids de catégories de jeux.");}
        // vérifier si les catégories existent
        for (let id of ids) {
            const gameCategory = await this.prismaService.gameCategory.findUnique({where: { id_category: id }});
            if (!gameCategory) { throw new NotFoundException("La catégorie de jeu avec l'id " + id + " n'existe pas.");}
        }
        // supprimer les catégories en BD
        await this.prismaService.gameCategory.deleteMany({where: { id_category: { in: ids }}});
        // retourner message de succès
        return { data: 'Catégories de jeu supprimées avec succès !' };
    }
}
