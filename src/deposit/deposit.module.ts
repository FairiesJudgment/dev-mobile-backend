import { Module } from '@nestjs/common';
import { DepositController } from './deposit.controller';
import { DepositService } from './deposit.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [DepositController],
  providers: [DepositService],
  imports: [JwtModule.register({})]
})
export class DepositModule {}
