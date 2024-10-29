import { Global, Module } from '@nestjs/common';
import { SellerController } from './seller.controller';
import { SellerService } from './seller.service';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Global()
@Module({
  controllers: [SellerController],
  providers: [SellerService, { provide: APP_GUARD, useClass: JwtAuthGuard }],
  exports: [SellerService]
})
export class SellerModule {}
