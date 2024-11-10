import { Global, Module } from '@nestjs/common';
import { SessionController } from './session.controller';
import { SessionService } from './session.service';
import { JwtModule } from '@nestjs/jwt';

@Global()
@Module({
  controllers: [SessionController],
  providers: [SessionService],
  imports: [JwtModule.register({})],
  exports: [SessionService]
})
export class SessionModule {}
