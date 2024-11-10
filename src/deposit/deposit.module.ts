import { Module } from '@nestjs/common';
import { DepositController } from './deposit.controller';
import { DepositService } from './deposit.service';
import { JwtModule } from '@nestjs/jwt';
import { DepositedGameService } from 'src/deposited-game/deposited-game.service';

@Module({
  controllers: [DepositController],
  providers: [DepositService, DepositedGameService],
  imports: [JwtModule.register({})]
})
export class DepositModule {}
