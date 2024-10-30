import { Module } from '@nestjs/common';
import { GameCategoryService } from './game-category.service';
import { GameCategoryController } from './game-category.controller';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Module({
  providers: [GameCategoryService, {provide : APP_GUARD, useClass : JwtAuthGuard}],
  controllers: [GameCategoryController],
  imports: [JwtModule.register({})]
})
export class GameCategoryModule {}
