import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSellerDto } from './dto/createSellerDto';
import { uuid } from 'uuidv4';
import { ManagerService } from 'src/manager/manager.service';
import { UpdateSellerDto } from './dto/updateSellerDto';

@Injectable()
export class SellerService {
    constructor(private readonly prismaService: PrismaService,
        private readonly managerService : ManagerService,
    ) {}

    async findSeller(options: {
        email?: string;
        id_seller?: string;
        username?: string;
    }) {
        const { email, id_seller, username } = options;
        const seller = await this.prismaService.seller.findUnique({
        where: email ? { email } : id_seller ? { id_seller } : { username },
        });
        return seller;
    }

    async validatePassword(
        password: string,
        password_salt: string,
        hash: string,
    ) {
        return await bcrypt.compare(password + password_salt, hash);
    }

    async getAll() {
        return await this.prismaService.seller.findMany();
    }

    async get(username: string, asker_id: any) {
        const seller = await this.findSeller({username : username});
        if (!seller) throw new NotFoundException("Ce vendeur n'existe pas.");
        // si la demande vient d'un manager return toutes les infos
        if (await this.managerService.findManager({id_manager : asker_id})) {
            return seller;
        }
        // sinon infos publiques seulement
        return {
            seller : {
                username : seller.username,
                firstname : seller.firstname,
                lastname : seller.lastname,
                email : seller.email,
            }
        }
    }


  async create(createSellerDto: CreateSellerDto) {
    const { username, email, password, firstname, lastname, phone, address } =
      createSellerDto;

    // verifier si seller existe déjà
    const seller = await this.findSeller({ email: email });
    if (seller) throw new ConflictException('Ce vendeur existe déjà.');

    //hasher mdp
    const salt = uuid();
    const hash = await bcrypt.hash(password + salt, 10);

    //enregistrer seller en BD
    await this.prismaService.seller.create({
      data: {
        username,
        email,
        password: hash,
        password_salt: salt,
        firstname,
        lastname,
        phone,
        address,
      },
    });

    return { data : 'Vendeur créé avec succès !' };
  }

  async update (id_seller: string, updateSellerDto: UpdateSellerDto, asker_id: any) {
            
    }
}
