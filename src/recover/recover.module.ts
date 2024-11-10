import { Module } from '@nestjs/common';
import { RecoverController } from './recover.controller';
import { RecoverService } from './recover.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [RecoverController],
  providers: [RecoverService],
  imports : [JwtModule.register({})]
})
export class RecoverModule {}
