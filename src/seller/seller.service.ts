import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSellerDto } from './dto/createSellerDto';
import { uuid } from 'uuidv4';
import { ManagerService } from 'src/manager/manager.service';
import { UpdateSellerDto } from './dto/updateSellerDto';
import { UpdatePasswordDto } from 'src/manager/dto/updatePasswordDto';

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

    // récupérer tous les vendeurs
    async getAll() {
        return await this.prismaService.seller.findMany();
    }

    // récupérer un vendeur selon son id
    async getById(id_seller: string) {
        const seller = await this.findSeller({id_seller : id_seller});
        if (!seller) throw new NotFoundException("Ce vendeur n'existe pas.");
        return seller;
    }

    // récupérer un vendeur selon son username
    async get(username: string, asker_id: string) {
        const seller = await this.findSeller({username : username});
        if (!seller) throw new NotFoundException("Ce vendeur n'existe pas.");
        // si la demande vient d'un manager return toutes les infos
        if (asker_id) {
            if (await this.managerService.findManager({id_manager : asker_id})) {
                return seller;
            }
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

    // créer un vendeur
    async create(createSellerDto: CreateSellerDto) {
        const { username, email, password, firstname, lastname, phone, address } =
        createSellerDto;

        // verifier si le mot de passe fait au moins 6 caractères
        if (password.length < 6)
            throw new ConflictException("Le mot de passe doit faire au moins 6 caractères.");

        // verifier si l'email n'est pas déjà utilisé
        if (email) {
            const seller = await this.findSeller({ email: email });
            if (seller) throw new ConflictException("Cet email est déjà utilisé par un vendeur.");
            const manager = await this.managerService.findManager({ email: email });
            if (manager) throw new ConflictException("Cet email est déjà utilisé par un manager.");
        }

        // verifier si le username n'est pas déjà utilisé
        if (username) {
            const seller = await this.findSeller({ username: username });
            if (seller) throw new ConflictException("Ce nom d'utilisateur est déjà utilisé par un vendeur.");
            const manager = await this.managerService.findManager({ username: username });
            if (manager) throw new ConflictException("Ce nom d'utilisateur est déjà utilisé par un manager.");
        }      

        // verifier si le téléphone n'est pas déjà utilisé
        if (phone) {
            const seller = await this.prismaService.seller.findFirst({ where: { phone: phone } });
            if (seller) throw new ConflictException("Ce numéro de téléphone est déjà utilisé par un vendeur.");
            const manager = await this.prismaService.manager.findFirst({ where: { phone: phone } });
            if (manager) throw new ConflictException("Ce numéro de téléphone est déjà utilisé par un manager.");
        }

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

    // modifier un vendeur
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
        
        // verifier que l'email n'est pas déjà utilisé
        const sellerEmail = await this.prismaService.seller.findUnique({where : {email : updateSellerDto.email, NOT : {id_seller : id_seller}}});
        if (sellerEmail) throw new ConflictException("Cet email est déjà utilisé par un vendeur.");
        const managerEmail = await this.prismaService.manager.findUnique({where : {email : updateSellerDto.email, NOT : {id_manager : id_seller}}});
        if (managerEmail) throw new ConflictException("Cet email est déjà utilisé par un manager.");

        // verifier que le username n'est pas déjà utilisé
        const sellerUsername = await this.prismaService.seller.findUnique({where : {username : updateSellerDto.username, NOT : {id_seller : id_seller}}});
        if (sellerUsername) throw new ConflictException("Ce nom d'utilisateur est déjà utilisé par un vendeur.");
        const managerUsername = await this.prismaService.manager.findUnique({where : {username : updateSellerDto.username, NOT : {id_manager : id_seller}}});
        if (managerUsername) throw new ConflictException("Ce nom d'utilisateur est déjà utilisé par un manager.");

        // verifier que le téléphone n'est pas déjà utilisé
        const sellerPhone = await this.prismaService.seller.findUnique({where : {phone : updateSellerDto.phone, NOT : {id_seller : id_seller}}});
        if (sellerPhone) throw new ConflictException("Ce numéro de téléphone est déjà utilisé par un vendeur.");
        const managerPhone = await this.prismaService.manager.findUnique({where : {phone : updateSellerDto.phone, NOT : {id_manager : id_seller}}});
        if (managerPhone) throw new ConflictException("Ce numéro de téléphone est déjà utilisé par un manager.");

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

    // supprimer un vendeur
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

    // supprimer plusieurs vendeurs
    async deleteMany(ids: string[]) {
        // verifier que ids est fourni
        if (ids == undefined) throw new NotFoundException("Vous devez fournir une liste d'ids de vendeurs.");
        // vérifier que les sellers existent
        for (let id of ids) {
            const seller = await this.findSeller({id_seller : id});
            if (!seller) throw new NotFoundException("Le vendeur avec l'id " + id + " n'existe pas.");
        }
        // supprimer les sellers dans la base de données
        await this.prismaService.seller.deleteMany({
            where : {
                id_seller : {
                    in : ids,
                },
            },
        });
        return { data : 'Vendeurs supprimés !' };
    }

    async getCurrentUser(id_seller: string) {
        // vérifier si le vendeur existe
        const seller = await this.findSeller({ id_seller: id_seller });
        if (!seller) throw new NotFoundException("Ce vendeur n'existe pas.");
        return seller;
    }

    async updatePassword (updatePasswordDto: UpdatePasswordDto, userId: string) {
        // vérifier que l'ancien mot de passe est correct
        const { oldPassword, newPassword } = updatePasswordDto;
        const seller = await this.findSeller({ id_seller: userId });
        if (!seller) throw new NotFoundException("Ce vendeur n'existe pas.");
        if (!(await this.validatePassword(oldPassword, seller.password_salt, seller.password)))
            throw new UnauthorizedException("Mot de passe incorrect.");
        // vérifier que le nouveau mot de passe fait au moins 4 caractères
        if (newPassword.length < 4)
            throw new ConflictException('Le mot de passe doit faire au moins 4 caractères.');
        // hasher le nouveau mot de passe
        const salt = uuid();
        const hash = await bcrypt.hash(newPassword + salt, 10);
        // mettre à jour le mot de passe
        await this.prismaService.seller.update({
            where: {
                id_seller: userId,
            },
            data: {
                password: hash,
                password_salt: salt,
            },
        });
        return { data: 'Mot de passe mis à jour !' };
    }
}
