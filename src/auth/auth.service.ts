import {
  Injectable,
} from '@nestjs/common';
import { LoginDto } from './dto/loginDto';
import { ManagerService } from 'src/manager/manager.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { SellerService } from 'src/seller/seller.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly managerService: ManagerService,
    private readonly sellerService : SellerService,
    private readonly jwtService : JwtService,
    private readonly configService : ConfigService,
  ) {}

  async validateUser(loginDto : LoginDto) {
    const {email, password} = loginDto;

    const manager = await this.managerService.findManager({ email : email });
    if (manager && await this.managerService.validatePassword(password, manager.password_salt, manager.password)) {
      return manager;
    }

    const seller = await this.sellerService.findSeller({ email : email });
    if (seller && await this.sellerService.validatePassword(password, seller.password_salt, seller.password)) {
      return seller;
    }

    return null;
  }

  async login(user : any) {
    let payload : any;
    // si l'utilisateur est un manager
    if (user.id_manager) {
      payload = {
        sub : user.id_manager,
        username : user.username,
        email : user.email,
      }
      const token = this.jwtService.sign(payload, {
        expiresIn : this.configService.get('TOKEN_DURATION'),
        secret : this.configService.get('TOKEN_SECRET'),
      });
      return { accesstoken : token, manager : user };
    }
    // si l'utilisateur est un seller
    else {
      payload = {
        sub : user.id_seller,
        username : user.username,
        email : user.email,
      }
      const token = this.jwtService.sign(payload, {
        expiresIn : this.configService.get('TOKEN_DURATION'),
        secret : this.configService.get('TOKEN_SECRET'),
      });
      return { accesstoken : token, seller : user };
    }
  }

  async verifyRole(email : string) {
    const manager = await this.managerService.findManager({ email : email });
    if (manager) {
      return 'manager';
    }

    const seller = await this.sellerService.findSeller({ email : email });
    if (seller) {
      return 'seller';
    }

    return null;
  }
}
