import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { GameService } from './game.service';
import { AdminGuard } from 'src/common/guards/admin.guard';
import { CreateGameDto } from './dto/createGameDto';
import { Public } from 'src/common/decorators/PublicDecorator';

@Controller('game')
export class GameController {

    constructor(private readonly gameService: GameService) {}

    @Get()
    getAll() {
        return this.gameService.getAll();
    }

    @Public()
    @Get(':id_game')
    get(@Param('id_game') id_game: number) {
        return this.gameService.get(id_game);
    }

    @UseGuards(AdminGuard)
    @Post()
    create(@Body() createGameDto: CreateGameDto) {
        return this.gameService.create(createGameDto);
    }
}
