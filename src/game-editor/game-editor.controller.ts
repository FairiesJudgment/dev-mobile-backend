import { Body, Controller, Delete, Post, Put, UseGuards } from '@nestjs/common';
import { GameEditorService } from './game-editor.service';
import { Get, Param } from '@nestjs/common';
import { Public } from 'src/common/decorators/PublicDecorator';
import { ManagerGuard } from 'src/common/guards/manager.guard';
import { CreateGameEditorDto } from './dto/createGameEditorDto';

@Controller('game-editor')
export class GameEditorController {

    constructor(private readonly gameEditorService: GameEditorService) {}

    @Public()
    @Get()
    getAll() {
        return this.gameEditorService.getAll();
    }

    @Public()
    @Get(':id_editor')
    get(@Param('id_editor') id_editor: number) {
        return this.gameEditorService.get(id_editor);
    }

    @UseGuards(ManagerGuard)
    @Post()
    create(@Body() createGameEditorDto: CreateGameEditorDto) {
        return this.gameEditorService.create(createGameEditorDto);
    }

    @UseGuards(ManagerGuard)
    @Put(':id_editor')
    update(@Param('id_editor') id_editor: number, @Body() updateGameEditorDto: CreateGameEditorDto) {
        return this.gameEditorService.update(id_editor, updateGameEditorDto);
    }

    @UseGuards(ManagerGuard)
    @Delete(':id_editor')
    delete(@Param('id_editor') id_editor: number) {
        return this.gameEditorService.delete(id_editor);
    }

    @UseGuards(ManagerGuard)
    @Delete()
    deleteMany(@Body() ids: number[]) {
        return this.gameEditorService.deleteMany(ids);
    }
}
