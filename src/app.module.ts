import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ManagerModule } from './manager/manager.module';
import { SellerModule } from './seller/seller.module';
import { ClientModule } from './client/client.module';
import { SessionModule } from './session/session.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), AuthModule, PrismaModule, ManagerModule, SellerModule, ClientModule, SessionModule],
})
export class AppModule {}
