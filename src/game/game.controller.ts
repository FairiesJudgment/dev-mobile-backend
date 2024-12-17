import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { GameService } from './game.service';
import { CreateGameDto } from './dto/createGameDto';
import { Public } from 'src/common/decorators/PublicDecorator';
import { ManagerGuard } from 'src/common/guards/manager.guard';
import { UpdateGameDto } from './dto/updateGameDto';

@Controller('game')
export class GameController {

    constructor(private readonly gameService: GameService) {}

    @Public()
    @Get()
    getAll() {
        return this.gameService.getAll();
    }

    @Public()
    @Get(':id_game')
    get(@Param('id_game', ParseIntPipe) id_game: number) {
        return this.gameService.get(id_game);
    }

    @Public()
    @Get('/name/:name')
    getByName(@Param('name') name: string) {
        return this.gameService.getByName(name);
    }

    @UseGuards(ManagerGuard)
    @Post()
    create(@Body() createGameDto: CreateGameDto) {
        return this.gameService.create(createGameDto);
    }

    @UseGuards(ManagerGuard)
    @Put(':id_game')
    update(@Param('id_game', ParseIntPipe) id_game: number, @Body() updateGameDto: UpdateGameDto) {
        return this.gameService.update(id_game, updateGameDto);
    }

    @UseGuards(ManagerGuard)
    @Delete(':id_game')
    delete(@Param('id_game', ParseIntPipe) id_game: number) {
        return this.gameService.delete(id_game);
    }

    @UseGuards(ManagerGuard)
    @Delete()
    deleteMany(@Body('ids') ids: number[]) {
        return this.gameService.deleteMany(ids);
    }
}
