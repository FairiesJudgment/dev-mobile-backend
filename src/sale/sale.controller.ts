import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Req, UseGuards } from '@nestjs/common';
import { SaleService } from './sale.service';
import { ManagerGuard } from 'src/common/guards/manager.guard';
import { CreateSaleDto } from './dto/createSaleDto';
import { Request } from 'express';
import { UpdateSaleDto } from './dto/updateSaleDto';

@Controller('sales')
export class SaleController {
    constructor(private readonly saleService : SaleService) {}

    @UseGuards(ManagerGuard)
    @Get()
    getAll() {
        return this.saleService.getAll();
    }

    @UseGuards(ManagerGuard) 
    @Get('/:id_sale')
    getById(@Param('id_sale') id_sale : string) {
        return this.saleService.getById(id_sale);
    }

    @UseGuards(ManagerGuard)
    @Get('/seller/:id_seller')
    getBySeller(@Param('id_seller') id_seller : string) {
        return this.saleService.getBySeller(id_seller);
    }

    @UseGuards(ManagerGuard)
    @Get('session/:id_session')
    getBySession(@Param('id_session', ParseIntPipe) id_session : number) {
        return this.saleService.getBySession(id_session)
    }

    @UseGuards(ManagerGuard)
    @Get('client/:id_client')
    getByClient(@Param('id_client', ParseIntPipe) id_client : number) {
        return this.saleService.geyByClient(id_client);
    }

    @UseGuards(ManagerGuard)
    @Get('game/:id_game')
    getByGame(@Param('id_game', ParseIntPipe) id_game : number) {
        return this.saleService.getByGame(id_game);
    }

    @UseGuards(ManagerGuard)
    @Post()
    create(@Body() createSaleDto : CreateSaleDto, @Req() request : Request) {
        const id_manager = request.user['id_manager'];
        return this.saleService.create(createSaleDto, id_manager);
    }

    @UseGuards(ManagerGuard)
    @Put('/:id_sale')
    update(@Body() updateSaleDto: UpdateSaleDto, @Param('id_sale') id_sale : string) {
        return this.saleService.update(updateSaleDto, id_sale);
    }

    @UseGuards(ManagerGuard)
    @Delete('/:id_sale')
    delete(@Param('id_sale') id_sale : string) {
        return this.saleService.delete(id_sale);
    }

}
