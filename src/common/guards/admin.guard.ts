import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { ManagerService } from 'src/manager/manager.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(
    private readonly prismaService : PrismaService,
    private readonly managerService : ManagerService,
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
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

      if (manager.is_admin === true) {
        return true;
      } else {
        throw new UnauthorizedException('Accès refusé');
      }
    } catch (error) {
      throw new UnauthorizedException('Token invalide');
    }
  }
}
