import { Injectable } from '@nestjs/common';
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

    async create(createSaleDto: CreateSaleDto, id_manager: any) {
        const {date, amount, comission, payment_method, id_seller, id_client, games_sold} = createSaleDto;
        await this.prismaService.saleTransaction.create({
            data : {
                date,
                amount,
                comission,
                payment_method,
                id_seller,
                id_client,
                games_sold,
                id_manager,
            },
        });
    }
}
