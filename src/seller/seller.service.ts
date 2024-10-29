import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SellerService {
    constructor(private readonly prismaService : PrismaService) {}

    async findSeller(email : string) {
        const seller = this.prismaService.seller.findUnique({
            where : {
                email,
            }
        });
        return seller;
    }

    async validatePassword(password : string, password_salt : string, hash : string) {
        return await bcrypt.compare(password + password_salt, hash);
      }
}
