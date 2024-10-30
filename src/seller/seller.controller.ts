import { Controller, Post, UseGuards, Get, Param, Req, Put, Delete } from '@nestjs/common';
import { ManagerGuard } from 'src/common/guards/manager.guard';
import { CreateSellerDto } from './dto/createSellerDto';
import { SellerService } from './seller.service';
import { Public } from 'src/common/decorators/PublicDecorator';
import { Request } from 'express';
import { UpdateSellerDto } from './dto/updateSellerDto';

@Controller('sellers')
export class SellerController {
    constructor(private readonly sellerService : SellerService) {}

    @UseGuards(ManagerGuard)
    @Get()
    getAll() {
        return this.sellerService.getAll();
    }

    @Public()
    @Get('/:username')
    get(@Param('username') username : string, @Req() request : Request) {
        const asker_id = request.user['id_manager'];
        console.log(`asker id : ${asker_id}`);
        return this.sellerService.get(username, asker_id);
    }

    @UseGuards(ManagerGuard)
    @Post()
    create(createSellerDto : CreateSellerDto) {
        this.sellerService.create(createSellerDto);
    }

    @Put('/update:id')
    update(@Param('id') id_seller : string, updateSellerDto : UpdateSellerDto, @Req() request : Request) {
        const asker_id = request.user['id_manager'] ? request.user['id_manager'] : request.user['id_seller'];
        return this.sellerService.update(id_seller, updateSellerDto, asker_id);
    }

    @UseGuards(ManagerGuard)
    @Delete('/delete:id')
    delete(@Param('id') id_seller : string) {
        return this.sellerService.delete(id_seller);
    }


}
