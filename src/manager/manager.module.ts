import { Global, Module } from '@nestjs/common';
import { ManagerController } from './manager.controller';
import { ManagerService } from './manager.service';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { JwtModule } from '@nestjs/jwt';

@Global()
@Module({
  controllers: [ManagerController],
  providers: [ManagerService, { provide: APP_GUARD, useClass: JwtAuthGuard}],
  exports: [ManagerService],
  imports: [JwtModule.register({})]
})
export class ManagerModule {}
