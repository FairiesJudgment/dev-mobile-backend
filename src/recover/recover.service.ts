import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateRecoverDto } from './dto/createRecoverDto';
import { UpdateRecoverDto } from './dto/updateRecoverDto';

@Injectable()
export class RecoverService {
    constructor(private readonly prismaService : PrismaService) {}

    async findRecover(id_recover : string) {
        const recover = await this.prismaService.recoverTransaction.findUnique({
            where : {
                id_recover,
            },
        });
        return recover;
    }

    async getByGame(id_game: number) {
        const gamesInRecovers = await this.prismaService.gameInRecoverTransaction.findMany({
            where : { id_game },
        });

        if (!gamesInRecovers.length) throw new NotFoundException("Ce jeu n'apparaît dans aucune transaction.");

        const recoverIds = gamesInRecovers.map(game_recover => game_recover.id_recover);

        const recovers = await this.prismaService.recoverTransaction.findMany({
            where : {
                id_recover : { in : recoverIds },
            },
        });

        const recoversWithGameData = recovers.map(recover => ({
            ...recover,
            game_data: gamesInRecovers.filter(game => game.id_recover === recover.id_recover).map(({ id_recover, ...gameData }) => gameData),
        }));
    
        return { data: recoversWithGameData };
    }

    async getBySession(id_session: number) {
        const recovers = await this.prismaService.recoverTransaction.findMany({
            where : {
                id_session,
            },
        });

        if (!recovers.length) throw new NotFoundException("Aucune transaction pour cette session.");

        const recoverIds = recovers.map(recover => recover.id_recover);

        const gamesInRecovers = await this.prismaService.gameInRecoverTransaction.findMany({
            where : {
                id_recover : { in : recoverIds },
            },
        });

        const recoversWithGameData = recovers.map(recover => ({
            ...recover,
            game_data: gamesInRecovers.filter(game => game.id_recover === recover.id_recover).map(({ id_recover, ...gameData }) => gameData),
        }));
    
        return { data: recoversWithGameData };
    }

    async getBySeller(id_seller: string) {
        const recovers = await this.prismaService.recoverTransaction.findMany({
            where : {
                id_seller,
            },
        });

        if (!recovers.length) throw new NotFoundException("Ce vendeur n'apparaît dans aucune transaction.");

        const recoverIds = recovers.map(recover => recover.id_recover);

        const gamesInRecovers = await this.prismaService.gameInRecoverTransaction.findMany({
            where : {
                id_recover : { in : recoverIds },
            },
        });

        const recoversWithGameData = recovers.map(recover => ({
            ...recover,
            game_data: gamesInRecovers.filter(game => game.id_recover === recover.id_recover).map(({ id_recover, ...gameData }) => gameData),
        }));
    
        return { data: recoversWithGameData };
    }

    async getById(id_recover: string) {
        const recover = await this.findRecover(id_recover);

        if (!recover) throw new NotFoundException("Cette transaction n'existe pas.");


        const gamesInRecover = await this.prismaService.gameInRecoverTransaction.findMany({
            where : {
                id_recover,
            },
        });

        const recoverWithGameData = {
            ...recover,
            game_data: gamesInRecover.map(({ id_recover, ...gameData }) => gameData),
        };
    
        return { data: recoverWithGameData };
    }

    async getAll() {
        const recovers = await this.prismaService.recoverTransaction.findMany();
        if(!recovers.length) throw new NotFoundException("Il n'y a aucune vente.");
        return recovers;
    }

    async create(id_manager: string, createRecoverDto: CreateRecoverDto) {
        const {amount, id_seller, id_session, games_recovered} = createRecoverDto;

        const recover = await this.prismaService.recoverTransaction.create({
            data : {
                amount,
                id_seller,
                id_session,
                id_manager,
            },
        });

        // pour stocker toutes les promesses
        const recoverPromises = games_recovered.map(async (game) => {
            const {id_game, quantity} = game;

            // récupérer les jeux invendus
            const depositedGames = await this.prismaService.depositedGame.findMany({
                where : {
                    id_game,
                    id_seller,
                    sold : false,
                },
                take : quantity,
                select : {
                    tag : true,
                },
            });

            const depositedGameTags = depositedGames.map((depositedGame) => depositedGame.tag);

            if (depositedGameTags.length < quantity) {
                throw new ConflictException("Il n'y a pas assez de jeux à récupérer.");
            }

            //créer les relations
            await this.prismaService.gameInRecoverTransaction.create({
                data : {
                    id_recover : recover.id_recover,
                    id_game,
                    tags : depositedGameTags,
                    quantity,
                },
            });

            //supprimer les jeux déposés
            await this.prismaService.depositedGame.deleteMany({
                where : {
                    tag : {
                        in : depositedGameTags,
                    },
                },
            });
        });

        // attendre que toutes les promesses se complètent
        await Promise.all(recoverPromises);

        return { data : 'Transaction créée avec succès !'}
    };

    async update(id_recover: string, updateRecoverDto: UpdateRecoverDto) {
        const {date, amount, id_seller, id_session} = updateRecoverDto;
        // verifier que la transaction existe
        const recover = await this.findRecover(id_recover);

        if (!recover) throw new NotFoundException("Cette transaction n'existe pas.");

        await this.prismaService.recoverTransaction.update({
            where : {
                id_recover,
            },
            data : {
                date, amount, id_seller, id_session
            },
        });
        

        return { data : 'Transaction mise à jour avec succès !' }
    }

    async delete(id_recover: string) {
        // verifier que la transaction existe
        const recover = await this.findRecover(id_recover);

        if (!recover) throw new NotFoundException("Cette transaction n'existe pas.");

        await this.prismaService.recoverTransaction.delete({
            where : {
                id_recover
            },
        });

        return { data : 'Transaction supprimée avec succès !' };
    }
}
