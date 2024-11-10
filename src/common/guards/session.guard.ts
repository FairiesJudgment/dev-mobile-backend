import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SessionGuard implements CanActivate {
  constructor(
    private readonly prismaService : PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const now = new Date();
    const session = await this.prismaService.session.findFirst({
        where : {
            date_begin : {lte : now},
            date_end : {gte : now},
        },
    });

    if (session) return true;
    else throw new UnauthorizedException("Aucune session active en ce moment !")
  }
}
