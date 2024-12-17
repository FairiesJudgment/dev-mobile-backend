import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { SessionService } from './session.service';
import { AdminGuard } from 'src/common/guards/admin.guard';
import { CreateSessionDto } from './dto/createSessionDto';
import { UpdateSessionDto } from './dto/updateSessionDto';
import { Public } from 'src/common/decorators/PublicDecorator';

@Controller('sessions')
export class SessionController {
    constructor(private readonly sessionService : SessionService) {}

    @Public()
    @Get()
    getAll() {
        return this.sessionService.getAll();
    }

    @Public()
    @Get('/opened')
    getOpened() {
        return this.sessionService.getOpened();
    }

    @Public()
    @Get('/:id')
    get(@Param('id') id_session : number) {
        return this.sessionService.get(id_session);
    }

    @UseGuards(AdminGuard)
    @Post()
    create(@Body() createSessionDto : CreateSessionDto) {
        return this.sessionService.create(createSessionDto);
    }

    @UseGuards(AdminGuard)
    @Put('update/:id')
    update(@Param('id', ParseIntPipe) id_session : number, @Body() updateSessionDto : UpdateSessionDto) {
        return this.sessionService.update(updateSessionDto, id_session);
    }

    @UseGuards(AdminGuard)
    @Delete('delete/:id')
    delete(@Param('id', ParseIntPipe) id_session : number) {
        return this.sessionService.delete(id_session);
    }

    @UseGuards(AdminGuard)
    @Delete()
    deleteMany(@Body('ids') ids : number[]) {
        return this.sessionService.deleteMany(ids);
    }
}
