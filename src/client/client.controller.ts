import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { ManagerGuard } from 'src/common/guards/manager.guard';
import { CreateClientDto } from './dto/createClientDto';
import { ClientService } from './client.service';
import { UpdateClientDto } from './dto/updateClientDto';

@Controller('clients')
export class ClientController {
    constructor(private readonly clientService : ClientService) {}

    @UseGuards(ManagerGuard)
    @Get()
    getAll() {
        return this.clientService.getAll();
    }

    @UseGuards(ManagerGuard)
    @Get('/:id')
    get(@Param('id') id_client : number) {
        return this.clientService.get(id_client);
    }

    @UseGuards(ManagerGuard)
    @Post()
    create(@Body() createClientDto : CreateClientDto) {
        return this.clientService.create(createClientDto);
    }

    @UseGuards(ManagerGuard)
    @Put('update/:id')
    update(@Param('id', ParseIntPipe) id_client : number, @Body() updateClientDto : UpdateClientDto) {
        return this.clientService.update(id_client, updateClientDto);
    }

    @UseGuards(ManagerGuard)
    @Delete('delete/:id')
    delete(@Param('id', ParseIntPipe) id_client : number) {
        return this.clientService.delete(id_client);
    }
    

}
