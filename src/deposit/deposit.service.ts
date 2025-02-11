import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDepositDto } from './dto/createDepositDto';
import { PrismaService } from 'src/prisma/prisma.service';
import { DepositedGameService } from 'src/deposited-game/deposited-game.service';
import { UpdateDepositDto } from './dto/updateDepositDto';

@Injectable()
export class DepositService {
    constructor(private readonly prismaService : PrismaService,
        private readonly depositedGameService : DepositedGameService,
    ) {}

    async getByGame(id_game: number) {
        const gamesInDeposits = await this.prismaService.gameInDepositTransaction.findMany({
            where : { id_game },
        });

        if (!gamesInDeposits.length) throw new NotFoundException("Ce jeu n'apparaît dans aucun dépôt.");

        const depositIds = gamesInDeposits.map(game_deposit => game_deposit.id_deposit);

        const deposits = await this.prismaService.depositTransaction.findMany({
            where : {
                id_deposit : { in : depositIds },
            },
        });

        const depositsWithGameData = deposits.map(deposit => ({
            ...deposit,
            games_deposited: gamesInDeposits.filter(game => game.id_deposit === deposit.id_deposit).map(({ id_deposit, ...gameData }) => gameData),
        }));
    
        return depositsWithGameData;
    }

    async getBySession(id_session: number) {
        const deposits = await this.prismaService.depositTransaction.findMany({
            where : {
                id_session,
            },
        });

        if (!deposits.length) throw new NotFoundException("Aucun dépôt pour cette session.");

        const depositIds = deposits.map(deposit => deposit.id_deposit);

        const gamesInDeposits = await this.prismaService.gameInDepositTransaction.findMany({
            where : {
                id_deposit : { in : depositIds },
            },
        });

        const depositsWithGameData = deposits.map(deposit => {
            const games_deposited = gamesInDeposits.filter(game => game.id_deposit === deposit.id_deposit);
            return {
            ...deposit,
            games_deposited
            };
        });
    
        return depositsWithGameData;
    }

    async getBySeller(id_seller: string) {
        const deposits = await this.prismaService.depositTransaction.findMany({
            where : {
                id_seller,
            },
        });

        if (!deposits.length) throw new NotFoundException("Ce vendeur n'a fait aucun dépôt.");

        const depositIds = deposits.map(deposit => deposit.id_deposit);

        const gamesInDeposits = await this.prismaService.gameInDepositTransaction.findMany({
            where : {
                id_deposit : { in : depositIds },
            },
        });

        const depositsWithGameData = deposits.map(deposit => ({
            ...deposit,
            games_deposited: gamesInDeposits.filter(game => game.id_deposit === deposit.id_deposit).map(({ id_deposit, ...gameData }) => gameData),
        }));
    
        return depositsWithGameData;
    }

    async getById(id_deposit: string) {
        const deposit = await this.prismaService.depositTransaction.findUnique({
            where : {
                id_deposit,
            },
        });

        if (!deposit) throw new NotFoundException("Ce dépôt n'existe pas.");


        const gamesInDeposit = await this.prismaService.gameInDepositTransaction.findMany({
            where : {
                id_deposit,
            },
        });

        const depositWithGameData = {
            ...deposit,
            games_deposited: gamesInDeposit.map(({ id_deposit, ...gameData }) => gameData),
        };
    
        return depositWithGameData;
    }

    async getAll() {
        const deposits = await this.prismaService.depositTransaction.findMany();
        if(!deposits.length) throw new NotFoundException("Il n'y a aucun dépôt.");
        return deposits;
    }

    async findDeposit(id_deposit : string) {
        const deposit = await this.prismaService.depositTransaction.findUnique({
            where : {
                id_deposit,
            },
        });

        return deposit
    }

    async create(id_manager: string, createDepositDto: CreateDepositDto) {
        const {date, amount, fees, discount, id_seller, id_session, games_deposited} = createDepositDto;

        const deposit = await this.prismaService.depositTransaction.create({
            data : {
                date, 
                amount,
                fees,
                discount,
                id_session,
                id_seller,
                id_manager,
            },
        });

        const gamesTags = await this.depositedGameService.create(games_deposited, id_seller, id_session)

        // pour chaque jeu
        const createPromises = gamesTags.map(async (game) => {
            // creer la relation
            await this.prismaService.gameInDepositTransaction.create({
                data: {
                    id_deposit: deposit.id_deposit,
                    id_game: game.id_game,
                    tags: game.tags,
                    quantity: game.quantity,
                },
            });
        });

        await Promise.all(createPromises);

        return { data : 'Dépôt enregistrée avec succès !'}
    }

    async update(id_deposit: string, updateDepositDto: UpdateDepositDto) {
        const {date, amount, fees, discount, id_seller, id_session} = updateDepositDto;
        // verifier que le depot existe
        const deposit = await this.findDeposit(id_deposit);
        if (!deposit) throw new NotFoundException("Ce dépôt n'existe pas.");

        await this.prismaService.depositTransaction.update({
            where : {
                id_deposit,
            },
            data : {
                date,
                amount,
                fees,
                discount,
                id_seller,
                id_session,
            },
        });

        return {data : 'Dépôt modifié avec succès !'};
    }

    async delete(id_deposit: string) {
        // verifier que le depot existe
        const deposit = await this.findDeposit(id_deposit);
        if (!deposit) throw new NotFoundException("Ce dépôt n'existe pas.");

        // récupérer les étiquettes des relations
        const relations = await this.prismaService.gameInDepositTransaction.findMany({
            where : {
                id_deposit,
            },
            select : {
                tags : true,
            },
        });

        const tags = relations.flatMap((relation) => relation.tags);

        // supprimer les jeux déposés
        // sauf les jeux vendus
        await this.prismaService.depositedGame.deleteMany({
            where : {
                tag : { in : tags },
                sold : false,
            }
        });

        await this.prismaService.depositTransaction.delete({
            where : {
                id_deposit,
            },
        });

        return { data : 'Dépôt supprimé avec succès !' };
    }
}
