import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { DepositedGameService } from './deposited-game.service';
import { Public } from 'src/common/decorators/PublicDecorator';
import { ManagerGuard } from 'src/common/guards/manager.guard';
import { UpdateDepositedGameDto } from './dto/updateDepositedGameDto';
import { CreateManyDepositedGameDto } from './dto/createManyDepositedGameDto';
import { SessionGuard } from 'src/common/guards/session.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('deposited-game')
export class DepositedGameController {

    constructor( private readonly depositedGameService: DepositedGameService) {}

    @Public()
    @Get()
    getAll() {
        return this.depositedGameService.getAll();
    }

    @Public()
    @Get('/tag/:tag')
    get(@Param('tag') tag: string) {
        return this.depositedGameService.get(tag);
    }

    @UseGuards(ManagerGuard)
    @Get('/game/:id_game')
    getByGame(@Param('id_game') id_game: number) {
        return this.depositedGameService.getByGame(id_game);
    }

    @UseGuards(JwtAuthGuard)
    @Get('/session/:id_session')
    getBySession(@Param('id_session') id_session: number) {
        return this.depositedGameService.getBySession(id_session);
    }

    @UseGuards(JwtAuthGuard)
    @Get('/seller/:id_seller')
    getBySeller(@Param('id_seller') id_seller: string) {
        return this.depositedGameService.getBySeller(id_seller);
    }

    @UseGuards(ManagerGuard, SessionGuard)
    @Post('')
    createMany(@Body() CreateManyDepositedGameDto: CreateManyDepositedGameDto) {
        return this.depositedGameService.createMany(CreateManyDepositedGameDto);
    }

    @UseGuards(ManagerGuard, SessionGuard)
    @Put('/:tag')
    update(@Param('tag') tag: string, @Body() updateDepositedGameDto: UpdateDepositedGameDto) {
        return this.depositedGameService.update(tag, updateDepositedGameDto);
    }

    @UseGuards(ManagerGuard)
    @Delete('/:tag')
    delete(@Param('tag') tag: string) {
        return this.depositedGameService.delete(tag);
    }
}
