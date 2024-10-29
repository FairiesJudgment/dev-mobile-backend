import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ManagerService } from 'src/manager/manager.service';
import { SellerService } from 'src/seller/seller.service';

type Payload = {
    sub : string;
    username : string;
    email : string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService : ConfigService,
    private readonly managerService : ManagerService,
    private readonly sellerService : SellerService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('TOKEN_SECRET'),
    });
  }

  async validate(payload: Payload) {
    // verifier si le token appartient à un manager
    const manager = await this.managerService.findManager(payload.email);
    // si on a trouvé un manager correpondant
    if (manager) {
        Reflect.deleteProperty(manager, "password");
        return manager;
    }
    // pas de manager correspondant, on cherche un seller
    const seller = await this.sellerService.findSeller(payload.email);
    // aucun seller ni manager
    if (!seller) throw new UnauthorizedException("Non authorisé !");
    // on a trouvé un seller
    Reflect.deleteProperty(seller, "password");
    return seller;
  }
}
