import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Req, UseGuards } from '@nestjs/common';
import { RecoverService } from './recover.service';
import { UpdateRecoverDto } from './dto/updateRecoverDto';
import { ManagerGuard } from 'src/common/guards/manager.guard';
import { CreateRecoverDto } from './dto/createRecoverDto';
import { SessionGuard } from 'src/common/guards/session.guard';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('recovers')
export class RecoverController {
    constructor(private readonly recoverService : RecoverService) {}

    @UseGuards(ManagerGuard)
    @Get()
    getAll() {
        return this.recoverService.getAll();
    }

    @UseGuards(ManagerGuard) 
    @Get('/:id_recover')
    getById(@Param('id_recover') id_recover : string) {
        return this.recoverService.getById(id_recover);
    }

    @UseGuards(JwtAuthGuard)
    @Get('/seller/:id_seller')
    getBySeller(@Param('id_seller') id_seller : string) {
        return this.recoverService.getBySeller(id_seller);
    }

    @UseGuards(ManagerGuard)
    @Get('session/:id_session')
    getBySession(@Param('id_session', ParseIntPipe) id_session : number) {
        return this.recoverService.getBySession(id_session)
    }

    @UseGuards(ManagerGuard)
    @Get('game/:id_game')
    getByGame(@Param('id_game', ParseIntPipe) id_game : number) {
        return this.recoverService.getByGame(id_game);
    }

    @UseGuards(ManagerGuard, SessionGuard)
    @Post()
    create(@Req() request : Request, @Body() createRecoverDto : CreateRecoverDto) {
        const id_manager = request.user['id_manager'];
        return this.recoverService.create(id_manager, createRecoverDto)
    }

    @UseGuards(ManagerGuard)
    @Put('/update/:id_recover')
    update(@Param('id_recover') id_recover : string, @Body() updateRecoverDto : UpdateRecoverDto) {
        return this.recoverService.update(id_recover, updateRecoverDto);
    }

    @UseGuards(ManagerGuard)
    @Delete('/delete/:id_recover')
    delete(@Param('id_recover') id_recover : string) {
        return this.recoverService.delete(id_recover);
    }
}
