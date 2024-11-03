import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ManagerModule } from './manager/manager.module';
import { SellerModule } from './seller/seller.module';
import { GameModule } from './game/game.module';
import { GameCategoryModule } from './game-category/game-category.module';
import { GameEditorModule } from './game-editor/game-editor.module';
import { ClientModule } from './client/client.module';
import { SessionModule } from './session/session.module';
import { DepositedGameModule } from './deposited-game/deposited-game.module';
import { SaleModule } from './sale/sale.module';
 
@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), AuthModule, PrismaModule, ManagerModule, SellerModule, ClientModule, GameModule, GameCategoryModule, GameEditorModule, SessionModule, DepositedGameModule, SaleModule],
  controllers: [],
  providers: [],
})
export class AppModule {}