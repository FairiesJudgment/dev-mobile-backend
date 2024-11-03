import { Module } from '@nestjs/common';
import { SaleController } from './sale.controller';
import { SaleService } from './sale.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [SaleController],
  providers: [SaleService],
  imports: [JwtModule.register({})]
})
export class SaleModule {}
