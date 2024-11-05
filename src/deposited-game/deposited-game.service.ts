import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateDepositedGameDto } from './dto/createDepositedGameDto';
import { UpdateDepositedGameDto } from './dto/updateDepositedGameDto';
import { CreateManyDepositedGameDto } from './dto/createManyDepositedGameDto';

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
            sold = false,
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

    // créer plusieurs jeux déposés
    async createMany(createManyDepositedGameDto: CreateManyDepositedGameDto) {

        const {
            price,
            quantity,
            number_for_sale,
            id_game,
            id_session,
            id_seller,
        } = createManyDepositedGameDto;

        // Vérifier si la quantité est supérieure à 0 et for_sale est inférieur ou égal
        if (quantity <= 0) { throw new NotFoundException("La quantité doit être supérieure à 0.");}
        if (number_for_sale > quantity) { throw new NotFoundException("La quantité en vente doit être inférieur ou égale à la quantité.");}

        // Vérifier si le jeu existe
        const game = await this.prismaService.game.findUnique({where: { id_game },});
        if (!game) { throw new NotFoundException("Ce jeu n'existe pas.");}

        // Vérifier si la session existe
        const session = await this.prismaService.session.findUnique({where: { id_session },});
        if (!session) { throw new NotFoundException("Cette session n'existe pas.");}

        // Vérifier si le vendeur existe
        const seller = await this.prismaService.seller.findUnique({where: { id_seller },});
        if (!seller) { throw new NotFoundException("Ce vendeur n'existe pas.");}
        
        // enregistrer les jeux déposés en BD
        for (let i = 0; i < number_for_sale; i++) {
            await this.prismaService.depositedGame.create({
                data: {
                    price,
                    sold : false,
                    for_sale :  true,
                    id_game,
                    id_session,
                    id_seller
                }
            });
        }

        for (let i = 0; i < quantity - number_for_sale; i++) {
            await this.prismaService.depositedGame.create({
                data: {
                    price,
                    sold : false,
                    for_sale : false,
                    id_game,
                    id_session,
                    id_seller
                }
            });
        }

        // retourner message de succès
        return { data: 'Jeux déposés créés avec succès !' };

    }

    // mettre à jour un jeu déposé
    // si il y a plusieurs jeux déposés avec le meme id_game, id_session et id_seller:
    // - on les met tous à jour
    // conditions à vérifier:
    // - le jeu déposé existe
    // - le jeu n'est pas vendu
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
        if (id_game) {
            const game = await this.prismaService.game.findUnique({where: { id_game },});
            if (!game) { throw new NotFoundException("Ce jeu n'existe pas.");}
        }

        // Vérifier si la session existe
        if (id_session) {
            const session = await this.prismaService.session.findUnique({where: { id_session },});
            if (!session) { throw new NotFoundException("Cette session n'existe pas.");}
        }

        // Vérifier si le vendeur existe
        if (id_seller) {
        const seller = await this.prismaService.seller.findUnique({where: { id_seller },});
        if (!seller) { throw new NotFoundException("Ce vendeur n'existe pas.");}
        }

        // mettre à jour le jeu déposé en BD
        // si il y a plusieurs jeux déposés avec le meme id_game, id_session et id_seller:
        // - on les met tous à jour
        await this.prismaService.depositedGame.updateMany({
            where: { id_game, id_seller, id_session, sold: false },
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
