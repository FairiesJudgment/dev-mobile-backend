import { Module } from '@nestjs/common';
import { ClientController } from './client.controller';
import { ClientService } from './client.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [ClientController],
  providers: [ClientService],
  imports: [JwtModule.register({})]
})
export class ClientModule {}
