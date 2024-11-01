import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateDepositedGameDto } from './dto/createDepositedGameDto';
import { UpdateDepositedGameDto } from './dto/updateDepositedGameDto';

@Injectable()
export class DepositedGameService {

    constructor( private readonly prismaService: PrismaService) {}

    // récupérer tous les jeux déposés
    async getAll() {
        return await this.prismaService.depositedGame.findMany();
    }

    // récupérer un jeu déposé selon son tag
    async get(tag: string) {
        // Vérifier si le jeu déposé existe
        const depositedGame = await this.prismaService.depositedGame.findUnique({where: { tag },});
        if (!depositedGame) { throw new NotFoundException("Ce jeu déposé n'existe pas.");}
        // Retourner les infos du jeu déposé
        return depositedGame;
    }

    // récupérer les jeux déposés d'un jeu
    async getByGame(id_game: number) {
        // Vérifier si le jeu existe
        const game = await this.prismaService.game.findUnique({where: { id_game },});
        if (!game) { throw new NotFoundException("Ce jeu n'existe pas.");}
        // Retourner les jeux déposés du jeu
        return await this.prismaService.depositedGame.findMany({where: { id_game },});
    }

    // récupérer les jeux déposés d'une session
    async getBySession(id_session: number) {
        // Vérifier si la session existe
        const session = await this.prismaService.session.findUnique({where: { id_session },});
        if (!session) { throw new NotFoundException("Cette session n'existe pas.");}
        // Retourner les jeux déposés de la session
        return await this.prismaService.depositedGame.findMany({where: { id_session },});
    }

    // récupérer les jeux déposés d'un vendeur
    async getBySeller(id_seller: string) {
        // Vérifier si le vendeur existe
        const seller = await this.prismaService.seller.findUnique({where: { id_seller },});
        if (!seller) { throw new NotFoundException("Ce vendeur n'existe pas.");}
        // Retourner les jeux déposés du vendeur
        return await this.prismaService.depositedGame.findMany({where: { id_seller },});
    }

    // créer un jeu déposé
    async create(createDepositedGameDto: CreateDepositedGameDto) {

        const {
            price,
            sold,
            for_sale,
            id_game,
            id_session,
            id_seller,
        } = createDepositedGameDto;

        // Vérifier si le jeu existe
        const game = await this.prismaService.game.findUnique({where: { id_game },});
        if (!game) { throw new NotFoundException("Ce jeu n'existe pas.");}

        // Vérifier si la session existe
        const session = await this.prismaService.session.findUnique({where: { id_session },});
        if (!session) { throw new NotFoundException("Cette session n'existe pas.");}

        // Vérifier si le vendeur existe
        const seller = await this.prismaService.seller.findUnique({where: { id_seller },});
        if (!seller) { throw new NotFoundException("Ce vendeur n'existe pas.");}
        
        // enregistrer le jeu déposé en BD
        await this.prismaService.depositedGame.create({
            data: {
                price,
                sold,
                for_sale,
                id_game,
                id_session,
                id_seller
            }
        });
        // retourner message de succès
        return { data: 'Jeu déposé créé avec succès !' };
    }

    // mettre à jour un jeu déposé
    async update(tag: string, updateDepositedGameDto: UpdateDepositedGameDto) {

        const {
            price,
            sold,
            for_sale,
            id_game,
            id_session,
            id_seller,
        } = updateDepositedGameDto;

        // Vérifier si le jeu déposé existe
        const depositedGame = await this.prismaService.depositedGame.findUnique({where: { tag },});
        if (!depositedGame) { throw new NotFoundException("Ce jeu déposé n'existe pas.");}

        // Vérifier si le jeu existe
        const game = await this.prismaService.game.findUnique({where: { id_game },});
        if (!game) { throw new NotFoundException("Ce jeu n'existe pas.");}

        // Vérifier si la session existe
        const session = await this.prismaService.session.findUnique({where: { id_session },});
        if (!session) { throw new NotFoundException("Cette session n'existe pas.");}

        // Vérifier si le vendeur existe
        const seller = await this.prismaService.seller.findUnique({where: { id_seller },});
        if (!seller) { throw new NotFoundException("Ce vendeur n'existe pas.");}
        
        // mettre à jour le jeu déposé en BD
        await this.prismaService.depositedGame.update({
            where: { tag },
            data: {
                price,
                sold,
                for_sale,
                id_game,
                id_session,
                id_seller
            }
        });
        // retourner message de succès
        return { data: 'Jeu déposé mis à jour avec succès !' };
    }

    // supprimer un jeu déposé
    async delete(tag: string) {
        // Vérifier si le jeu déposé existe
        const depositedGame = await this.prismaService.depositedGame.findUnique({where: { tag },});
        if (!depositedGame) { throw new NotFoundException("Ce jeu déposé n'existe pas.");}
        // Supprimer le jeu déposé
        await this.prismaService.depositedGame.delete({where: { tag },});
        // retourner message de succès
        return { data: 'Jeu déposé supprimé avec succès !' };
    }
}
