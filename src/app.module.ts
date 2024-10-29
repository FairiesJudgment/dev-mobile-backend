import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ManagerModule } from './manager/manager.module';
import { SellerModule } from './seller/seller.module';
import { GamesController } from './games/games.controller';
import { GamesService } from './games/games.service';
import { GamesModule } from './games/games.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), AuthModule, PrismaModule, ManagerModule, SellerModule, GamesModule],
  controllers: [GamesController],
  providers: [GamesService],
})
export class AppModule {}
