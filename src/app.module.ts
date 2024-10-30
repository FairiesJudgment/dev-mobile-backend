import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ManagerModule } from './manager/manager.module';
import { SellerModule } from './seller/seller.module';
import { GameModule } from './game/game.module';
import { GameCategoryModule } from './game-category/game-category.module';
import { GameEditorModule } from './game-editor/game-editor.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), AuthModule, PrismaModule, ManagerModule, SellerModule, GameModule, GameCategoryModule, GameEditorModule],
})
export class AppModule {}