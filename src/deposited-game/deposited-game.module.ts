import { Global, Module } from '@nestjs/common';
import { DepositedGameService } from './deposited-game.service';
import { DepositedGameController } from './deposited-game.controller';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { SessionModule } from 'src/session/session.module';

@Global()
@Module({
  providers: [DepositedGameService, {provide : APP_GUARD, useClass : JwtAuthGuard}],
  controllers: [DepositedGameController],
  imports: [JwtModule.register({}), SessionModule]
})
export class DepositedGameModule {}
