import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SellerService {
    constructor(private readonly prismaService : PrismaService) {}

    async findSeller(options: { email?: string, id_seller?: string, username?: string}) {
        const { email, id_seller, username } = options;
        const seller = this.prismaService.seller.findUnique({
            where : email ? { email } : id_seller ? { id_seller } : { username }
        });
        return seller;
    }

    async validatePassword(password : string, password_salt : string, hash : string) {
        return await bcrypt.compare(password + password_salt, hash);
      }
}
