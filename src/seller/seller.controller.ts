import { Controller, Post, UseGuards, Get, Param, Req, Put, Delete, Body } from '@nestjs/common';
import { ManagerGuard } from 'src/common/guards/manager.guard';
import { CreateSellerDto } from './dto/createSellerDto';
import { SellerService } from './seller.service';
import { Public } from 'src/common/decorators/PublicDecorator';
import { Request } from 'express';
import { UpdateSellerDto } from './dto/updateSellerDto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Controller('sellers')
export class SellerController {
    constructor(private readonly sellerService : SellerService,
        private readonly jwtService : JwtService,
        private readonly configService : ConfigService,
    ) {}

    @UseGuards(ManagerGuard)
    @Get()
    getAll() {
        return this.sellerService.getAll();
    }

    @Public()
    @Get('/id/:id_seller')
    getById(@Param('id_seller') id_seller : string) {
        return this.sellerService.getById(id_seller);
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
        return this.sellerService.get(username, asker_id);
    }

    @UseGuards(ManagerGuard)
    @Post()
    create(@Body() createSellerDto : CreateSellerDto) {
        return this.sellerService.create(createSellerDto);
    }

    @UseGuards(ManagerGuard)
    @Put('/update/:id')
    update(@Param('id') id_seller : string, @Body() updateSellerDto : UpdateSellerDto, @Req() request : Request) {
        const asker_id = request.user['id_manager'] ? request.user['id_manager'] : request.user['id_seller'];
        return this.sellerService.update(id_seller, updateSellerDto, asker_id);
    }

    @UseGuards(ManagerGuard)
    @Delete('/delete/:id')
    delete(@Param('id') id_seller : string) {
        return this.sellerService.delete(id_seller);
    }

    @UseGuards(ManagerGuard)
    @Delete()
    deleteMany(@Body() ids: string[]) {
        return this.sellerService.deleteMany(ids);
    }

    @UseGuards()
    @Get('/get/current')
    getCurrentUser(@Req() request : Request) {
        const userId = request.user['id_seller'];
        return this.sellerService.getCurrentUser(userId);      
    }
}
