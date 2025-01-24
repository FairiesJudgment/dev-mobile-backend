import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class GameEditorService {

    constructor(private readonly prismaService: PrismaService) {}

    // récupérer tous les éditeurs de jeux
    async getAll() {
        return await this.prismaService.gameEditor.findMany();
    }

    // récupérer un éditeur de jeu selon son id
    async get(id_editor: number) {
        // Verifier si id_editor est défini
        if (!id_editor) { throw new NotFoundException("Vous devez fournir l'identifiant de l'éditeur.");}
        // Vérifier si l'éditeur existe
        const gameEditor = await this.prismaService.gameEditor.findUnique({where: { id_editor: Number(id_editor) },});
        if (!gameEditor) { throw new NotFoundException("Cet éditeur de jeu n'existe pas.");}
        return gameEditor;
    }

    // créer un éditeur de jeu
    async create(createGameEditorDto: any) {
        const { name, description } = createGameEditorDto;

        // vérifier si l'éditeur existe déjà
        const gameEditor = await this.prismaService.gameEditor.findUnique({where: { name },});
        if (gameEditor) { throw new ConflictException("Cet éditeur de jeu existe déjà.");}

        // vérifier si le nom de l'éditeur n'existe pas déjà
        const gameEditorName = await this.prismaService.gameEditor.findUnique({where: { name },});
        if (gameEditorName) { throw new ConflictException("Ce nom d'éditeur existe déjà.");}

        // enregistrer l'éditeur en BD
        await this.prismaService.gameEditor.create({
            data: {
                name,
                description
            }
        });
        // retourner message de succès
        return { data: 'Éditeur de jeu créé avec succès !' };
    }

    // modifier un éditeur de jeu
    async update(id_editor: number, updateGameEditorDto: any) {
        const { name, description } = updateGameEditorDto;

        // vérifier si l'éditeur existe
        const gameEditor = await this.prismaService.gameEditor.findUnique({where: { id_editor: Number(id_editor) }});
        if (!gameEditor) { throw new NotFoundException("Cet éditeur de jeu n'existe pas.");}

        // vérifier si le nom de l'éditeur n'existe pas déjà et n'est pas le même que celui de l'éditeur
        if (name) {
            const gameEditorName = await this.prismaService.gameEditor.findUnique({where: { name },});
            if (gameEditorName && gameEditorName.id_editor != id_editor) { throw new ConflictException("Ce nom d'éditeur existe déjà.");}
        }
        
        // modifier l'éditeur en BD
        await this.prismaService.gameEditor.update({
            where: { id_editor: Number(id_editor) },
            data: {
                name,
                description
            }
        });
        // retourner message de succès
        return { data: 'Éditeur de jeu modifié avec succès !' };
    }

    // supprimer un éditeur de jeu
    async delete(id_editor: number) {
        // vérifier si l'éditeur existe
        const gameEditor = await this.prismaService.gameEditor.findUnique({where: { id_editor: Number(id_editor) }});
        if (!gameEditor) { throw new NotFoundException("Cet éditeur de jeu n'existe pas.");}

        // supprimer l'éditeur en BD
        await this.prismaService.gameEditor.delete({where: { id_editor: Number(id_editor) }});
        // retourner message de succès
        return { data: 'Éditeur de jeu supprimé avec succès !' };
    }

    // supprimer plusieurs éditeurs de jeux
    async deleteMany(ids: number[]) {
        // verifier que ids est fourni
        if (ids == undefined) { throw new NotFoundException("Vous devez fournir une liste d'ids d'éditeurs.");}
        // vérifier si les éditeurs existent
        for (let id of ids) {
            const gameEditor = await this.prismaService.gameEditor.findUnique({where: { id_editor: id },});
            if (!gameEditor) { throw new NotFoundException("L'éditeur avec l'id " + id + " n'existe pas.");}
        }
        // supprimer les éditeurs en BD
        await this.prismaService.gameEditor.deleteMany({where: { id_editor: { in: ids }},});
        // retourner message de succès
        return { data: 'Éditeurs de jeu supprimés avec succès !' };
    }
}
