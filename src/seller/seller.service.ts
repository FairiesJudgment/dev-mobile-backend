import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
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
        // verifier que seller existe
        const seller = await this.findSeller({id_seller : id_seller});
        if (!seller) throw new NotFoundException("Ce vendeur n'exsite pas.");
        // si demandeur pas propriétaire du compte
        if (asker_id !== id_seller) {
            // verifier que c'est un manager
            const asker = await this.managerService.findManager({id_manager : asker_id});
            if (!asker) throw new UnauthorizedException("Opération interdite");
        }
        // appliquer modifications
        await this.prismaService.seller.update({
            where : {
                id_seller,
            },
            data : {
                ...updateSellerDto,
            },
        });
        return { data : 'Vendeur mis à jour !' };
    }

    async delete(id_seller: string) {
        // vérifier que le seller existe
        const seller = await this.findSeller({id_seller : id_seller});
        if (!seller) throw new NotFoundException("Ce vendeur n'existe pas.");
        await this.prismaService.seller.delete({
            where : {
                id_seller,
            },
        });
        return { data : 'Vendeur supprimé !' };
    }
}
