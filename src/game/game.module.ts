import { Global, Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { JwtModule } from '@nestjs/jwt';

@Global()
@Module({
    controllers: [GameController],
    providers: [GameService, {provide : APP_GUARD, useClass : JwtAuthGuard}],
    imports: [JwtModule.register({})]
})
export class GameModule {}
