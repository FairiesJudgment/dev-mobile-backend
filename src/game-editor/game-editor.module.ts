import { Global, Module } from '@nestjs/common';
import { GameEditorService } from './game-editor.service';
import { GameEditorController } from './game-editor.controller';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { JwtModule } from '@nestjs/jwt';

@Global()
@Module({
  providers: [GameEditorService, {provide : APP_GUARD, useClass : JwtAuthGuard}],
  controllers: [GameEditorController],
  imports: [JwtModule.register({})]
})
export class GameEditorModule {}
