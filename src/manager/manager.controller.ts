import { Body, Controller, Param, Post, UseGuards, Delete, Put, Req, Get } from '@nestjs/common';
import { ManagerService } from './manager.service';
import { CreateManagerDto } from './dto/createManagerDto';
import { AdminGuard } from 'src/common/guards/admin.guard';
import { UpdateManagerDto } from './dto/updateManagerDto';
import { Request } from 'express';
import { Public } from 'src/common/decorators/PublicDecorator';

@Controller('managers')
export class ManagerController {
    constructor(private readonly managerService : ManagerService) {}

    @UseGuards(AdminGuard)
    @Get()
    getAll() {
        return this.managerService.getAll();
    }

    @Public()
    @Get(':username')
    get(@Param('username') username : string) {
        return this.managerService.get(username);
    } 

    @UseGuards(AdminGuard)
    @Post()
    create(@Body() createManagerDto : CreateManagerDto) {
        return this.managerService.create(createManagerDto);
    }

    @UseGuards(AdminGuard)
    @Delete('/delete:id')
    delete(@Param('id') id_manager : string) {
        return this.managerService.delete(id_manager);
    }

    @Put('/update:id')
    update(@Param('id') id_manager : string, updateManagerDto : UpdateManagerDto, @Req() request : Request) {
        const asker_id = request.user['id_manager']
        return this.managerService.update(id_manager, updateManagerDto, asker_id);
    }

}
