import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Req, UseGuards } from '@nestjs/common';
import { DepositService } from './deposit.service';
import { ManagerGuard } from 'src/common/guards/manager.guard';
import { SessionGuard } from 'src/common/guards/session.guard';
import { Request } from 'express';
import { CreateDepositDto } from './dto/createDepositDto';
import { UpdateDepositDto } from './dto/updateDepositDto';

@Controller('deposits')
export class DepositController {
    constructor(private readonly depositService : DepositService) {}

    @UseGuards(ManagerGuard)
    @Get()
    getAll() {
        return this.depositService.getAll();
    }

    @UseGuards(ManagerGuard) 
    @Get('/:id_deposit')
    getById(@Param('id_deposit') id_deposit : string) {
        return this.depositService.getById(id_deposit);
    }

    @UseGuards(ManagerGuard)
    @Get('/seller/:id_seller')
    getBySeller(@Param('id_seller') id_seller : string) {
        return this.depositService.getBySeller(id_seller);
    }

    @UseGuards(ManagerGuard)
    @Get('session/:id_session')
    getBySession(@Param('id_session', ParseIntPipe) id_session : number) {
        return this.depositService.getBySession(id_session)
    }

    @UseGuards(ManagerGuard)
    @Get('game/:id_game')
    getByGame(@Param('id_game', ParseIntPipe) id_game : number) {
        return this.depositService.getByGame(id_game);
    }

    @UseGuards(ManagerGuard, SessionGuard)
    @Post()
    create(@Req() request : Request, @Body() createDepositDto : CreateDepositDto) {
        const id_manager = request.user['id_manager'];
        return this.depositService.create(id_manager, createDepositDto)
    }

    @UseGuards(ManagerGuard)
    @Put('/update/:id_deposit')
    update(@Param('id_deposit') id_deposit : string, @Body() updateDepositDto : UpdateDepositDto) {
        return this.depositService.update(id_deposit, updateDepositDto);
    }

    @UseGuards(ManagerGuard)
    @Delete('/delete/:id_deposit')
    delete(@Param('id_deposit') id_deposit : string) {
        return this.depositService.delete(id_deposit);
    }
}
