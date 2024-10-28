import { Module } from '@nestjs/common';
import { ManagerController } from './manager.controller';
import { ManagerService } from './manager.service';

@Module({
  exports: [ManagerService],
  controllers: [ManagerController],
  providers: [ManagerService]
})
export class ManagerModule {}
