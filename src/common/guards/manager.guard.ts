import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { ManagerService } from 'src/manager/manager.service';

@Injectable()
export class ManagerGuard implements CanActivate {
  constructor(
    private readonly managerService : ManagerService,
    private readonly jwtService: JwtService,
    private readonly configService : ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('Authorization header manquant');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Token manquant');
    }

    try {
      const payload = this.jwtService.verify(token, {secret : this.configService.get('TOKEN_SECRET')});

      const manager = await this.managerService.findManager({ id_manager : payload.sub})

      if (manager) {
        return true;
      } else {
        throw new UnauthorizedException('Accès refusé');
      }
    } catch (error) {
      throw new UnauthorizedException('Token invalide');
    }
  }
}
