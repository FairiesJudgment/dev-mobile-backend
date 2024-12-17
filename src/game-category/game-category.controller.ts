import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { GameCategoryService } from './game-category.service';
import { Public } from 'src/common/decorators/PublicDecorator';
import { ManagerGuard } from 'src/common/guards/manager.guard';
import { CreateGameCategoryDto } from './dto/createGameCategoryDto';
import { UpdateGameCategoryDto } from './dto/updateGameCategoryDto';

@Controller('game-category')
export class GameCategoryController {

    constructor(private readonly gameCategoryService: GameCategoryService) {}

    @Public()
    @Get()
    getAll() {
        return this.gameCategoryService.getAll();
    }

    @Public()
    @Get(':id_category')
    get(@Param('id_category') id_category: number) {
        return this.gameCategoryService.get(id_category);
    }

    @UseGuards(ManagerGuard)
    @Post()
    create(@Body() createGameCategoryDto: CreateGameCategoryDto) {
        return this.gameCategoryService.create(createGameCategoryDto);
    }

    @UseGuards(ManagerGuard)
    @Put(':id_category')
    update(@Param('id_category') id_category: number, @Body() updateGameCategoryDto: UpdateGameCategoryDto) {
        return this.gameCategoryService.update(id_category, updateGameCategoryDto);
    }

    @UseGuards(ManagerGuard)
    @Delete(':id_category')
    delete(@Param('id_category') id_category: number) {
        return this.gameCategoryService.delete(id_category);
    }

    @UseGuards(ManagerGuard)
    @Delete()
    deleteMany(@Body() ids: number[]) {
        return this.gameCategoryService.deleteMany(ids);
    }
}
