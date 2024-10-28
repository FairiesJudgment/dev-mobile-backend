import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto } from './dto/loginDto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ManagerService } from 'src/manager/manager.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly managerService: ManagerService,
    private readonly jwtService : JwtService,
    private readonly configService : ConfigService,
  ) {}

  async managerLogin(loginDto: LoginDto) {
    const { email, password } = loginDto;
    // chercher utilisateur dans la table manager
    const manager = await this.managerService.findManager(email);
    if (!manager)
      throw new NotFoundException('Email ou mot de passe incorrect(s).');
    const match = bcrypt.compare(password, manager.password + manager.password_salt);
    if (!match)
      throw new UnauthorizedException('Email ou mot de passe incorrect(s).');
    const payload = {
        id_manager : manager.id_manager,
        username : manager.username,
        isAdmin : manager.is_admin
    };
    const token = this.jwtService.sign(payload, {
        expiresIn: this.configService.get("TOKEN_DURATION"),
        secret: this.configService.get("TOKEN_SECRET"),
    });

    return token;
  }
}
