import { Body, Controller, Post } from '@nestjs/common';
import { ManagerService } from './manager.service';
import { CreateManagerDto } from './dto/createManagerDto';

@Controller('manager')
export class ManagerController {
    constructor(private readonly managerService : ManagerService) {}

    @Post()
    create(@Body() createManagerDto : CreateManagerDto) {
        return this.managerService.create(createManagerDto)
    }
}
