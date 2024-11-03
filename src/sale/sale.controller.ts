import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { SaleService } from './sale.service';
import { ManagerGuard } from 'src/common/guards/manager.guard';
import { CreateSaleDto } from './createSaleDto';
import { Request } from 'express';

@Controller('sales')
export class SaleController {
    constructor(private readonly saleService : SaleService) {}

    @UseGuards(ManagerGuard)
    @Post()
    create(@Body() createSaleDto : CreateSaleDto, @Req() request : Request) {
        const id_manager = request.user['id_manager'];
        return this.saleService.create(createSaleDto, id_manager);
    }
}
