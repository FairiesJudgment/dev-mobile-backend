import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/loginDto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService : AuthService) {}

    @Post('manager-login')
    maangerLogin(@Body() loginDto : LoginDto) {
        return this.authService.managerLogin(loginDto);
    }
}
