import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSaleDto } from './createSaleDto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SaleService {
    constructor(private readonly prismaService : PrismaService) {}

    async findSale(id_sale : string) {
        if (!id_sale) throw new Error("Vous devez fournir un id de vente.");
        return await this.prismaService.saleTransaction.findUnique({
            where : {
                id_sale,
            },
        });
    }

    async getByGame(id_game: number) {
        const gamesInSales = await this.prismaService.gameInSaleTransaction.findMany({
            where : { id_game },
        });

        if (!gamesInSales) throw new NotFoundException("Ce jeu n'apparaît dans aucune transaction de vente.");

        const saleIds = gamesInSales.map(game_sale => game_sale.id_sale);

        const sales = await this.prismaService.saleTransaction.findMany({
            where : {
                id_sale : { in : saleIds },
            },
        });

        const salesWithGameData = sales.map(sale => ({
            ...sale,
            game_data: gamesInSales.filter(game => game.id_sale === sale.id_sale).map(({ id_sale, ...gameData }) => gameData),
        }));
    
        return { data: salesWithGameData };
    }

    async geyByClient(id_client: number) {
        const sales = await this.prismaService.saleTransaction.findMany({
            where : {
                id_client,
            },
        });

        if (!sales) throw new NotFoundException("Ce client n'apparaît dans aucune transaction de vente.");

        const saleIds = sales.map(sale => sale.id_sale);

        const gamesInSales = await this.prismaService.gameInSaleTransaction.findMany({
            where : {
                id_sale : { in : saleIds },
            },
        });

        const salesWithGameData = sales.map(sale => ({
            ...sale,
            game_data: gamesInSales.filter(game => game.id_sale === sale.id_sale).map(({ id_sale, ...gameData }) => gameData),
        }));
    
        return { data: salesWithGameData };
    }

    async getBySession(id_session: number) {
        // on a pas id_session en BD, rajouter ou non?
    }

    async getBySeller(id_seller: string) {
        const sales = await this.prismaService.saleTransaction.findMany({
            where : {
                id_seller,
            },
        });

        if (!sales) throw new NotFoundException("Ce client n'apparaît dans aucune transaction de vente.");

        const saleIds = sales.map(sale => sale.id_sale);

        const gamesInSales = await this.prismaService.gameInSaleTransaction.findMany({
            where : {
                id_sale : { in : saleIds },
            },
        });

        const salesWithGameData = sales.map(sale => ({
            ...sale,
            game_data: gamesInSales.filter(game => game.id_sale === sale.id_sale).map(({ id_sale, ...gameData }) => gameData),
        }));
    
        return { data: salesWithGameData };
    }

    async getById(id_sale: string) {
        const sale = await this.prismaService.saleTransaction.findUnique({
            where : {
                id_sale,
            },
        });

        if (!sale) throw new NotFoundException("Ce client n'apparaît dans aucune transaction de vente.");


        const gamesInSale = await this.prismaService.gameInSaleTransaction.findMany({
            where : {
                id_sale,
            },
        });

        const saleWithGameData = {
            ...sale,
            game_data: gamesInSale.map(({ id_sale, ...gameData }) => gameData),
        };
    
        return { data: saleWithGameData };
    }

    async getAll() {
        const sales = await this.prismaService.saleTransaction.findMany();
        if(!sales) throw new NotFoundException("Il n'y a aucune vente.");
        return sales;
    }

    async create(createSaleDto: CreateSaleDto, id_manager: any) {
        const { games_sold } = createSaleDto;
        const sale = await this.prismaService.saleTransaction.create({
            data : {
                ...createSaleDto,
                id_manager,
            },
        });

        const createPromises = games_sold.map((game) =>
            this.prismaService.gameInSaleTransaction.create({
                data: {
                    id_sale: sale.id_sale,
                    id_game: game.id_game,
                    tags: game.tags,
                    quantity: game.quantity,
                },
            })
        );

        await Promise.all(createPromises);

        return { data : 'Transaction enregistrée avec succès !'}
    }
}
