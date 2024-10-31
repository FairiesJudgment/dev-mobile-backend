import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Public } from 'src/common/decorators/PublicDecorator';

@Controller('auth')
export class AuthController {
    
    constructor(private readonly authService : AuthService) {}

    @UseGuards(LocalAuthGuard)
    @Public()
    @Post('login')
    async login(@Request() req) {
        return this.authService.login(req.user);
    }

    @UseGuards(JwtAuthGuard)
    @Post('logout')
    async logout(@Request() req) {
        return req.logout();
    }
}
