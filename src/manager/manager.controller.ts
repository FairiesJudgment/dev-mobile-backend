import { Body, Controller, Param, Post, UseGuards, Delete, Put, Req, Get } from '@nestjs/common';
import { ManagerService } from './manager.service';
import { CreateManagerDto } from './dto/createManagerDto';
import { AdminGuard } from 'src/common/guards/admin.guard';
import { UpdateManagerDto } from './dto/updateManagerDto';
import { Request } from 'express';
import { Public } from 'src/common/decorators/PublicDecorator';
import { ManagerGuard } from 'src/common/guards/manager.guard';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Controller('managers')
export class ManagerController {
    constructor(private readonly managerService : ManagerService,
        private readonly jwtService : JwtService,
        private readonly configService : ConfigService,
    ) {}

    @UseGuards(AdminGuard)
    @Get()
    getAll() {
        return this.managerService.getAll();
    }

    @Public()
    @Get('/:username')
    get(@Param('username') username : string, @Req() request : Request) {
        const authHeaders = request.headers.authorization;
        let payload = {};
        let asker_id = "";
        if (authHeaders) {
            const token = request.headers.authorization.split(' ')[1];
            payload = this.jwtService.verify(token, {secret : this.configService.get('TOKEN_SECRET')});
            asker_id = payload['sub'];
        }
        return this.managerService.get(username, asker_id);
    } 

    @UseGuards(AdminGuard)
    @Post()
    create(@Body() createManagerDto : CreateManagerDto) {
        return this.managerService.create(createManagerDto);
    }

    @UseGuards(AdminGuard)
    @Delete('/delete/:id')
    delete(@Param('id') id_manager : string) {
        return this.managerService.delete(id_manager);
    }

    @UseGuards(ManagerGuard)
    @Put('/update/:id')
    update(@Param('id') id_manager : string, @Body() updateManagerDto : UpdateManagerDto, @Req() request : Request) {
        const asker_id = request.user['id_manager'];
        return this.managerService.update(id_manager, updateManagerDto, asker_id);
    }
}
