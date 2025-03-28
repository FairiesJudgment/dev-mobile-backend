import {
  UnauthorizedException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateManagerDto } from './dto/createManagerDto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { uuid } from 'uuidv4';
import { UpdateManagerDto } from './dto/updateManagerDto';
import { UpdatePasswordDto } from './dto/updatePasswordDto';

@Injectable()
export class ManagerService {
  
  constructor(private readonly prismaService: PrismaService) {}

  // trouver un manager selon son email, son id ou son pseudo
  async findManager(options: {
    email?: string;
    id_manager?: string;
    username?: string;
  }) {
    const { email, id_manager, username } = options;

    if (!email && !id_manager && !username) {
      throw new Error(
        'Vous devez fournir au moins un élément parmi un email, un id ou un pseudo.',
      );
    }

    const manager = await this.prismaService.manager.findUnique({
      where: email ? { email } : id_manager ? { id_manager } : { username },
    });

    return manager;
  }

  async validatePassword(
    password: string,
    password_salt: string,
    hash: string,
  ) {
    return await bcrypt.compare(password + password_salt, hash);
  }

  // récupérer tous les managers
  async getAll() {
    return await this.prismaService.manager.findMany();
  }

  // récupérer un manager selon son pseudo
  async get(username: string, asker_id: any) {
    // vérifier si le manager existe
    const manager = await this.findManager({ username: username });
    if (!manager) throw new NotFoundException("Ce manager n'existe pas.");
    // si la demande vient d'un utilisateur connecté
    if (asker_id) {
      //si la demande vient d'un manager retourne toutes les infos
      if (await this.findManager({id_manager : asker_id})) return manager;
    }
    // sinon infos publiques seulement
    return {
      manager: {
        username: manager.username,
        firstname: manager.firstname,
        lastname: manager.lastname,
        email: manager.email,
      },
    };
  }

  async getCurrentUser(id_manager: string) {
    // vérifier si le manager existe
    const manager = await this.findManager({ id_manager: id_manager });
    if (!manager) throw new NotFoundException("Ce manager n'existe pas.");
    return manager;
  }

  // enregistrer un manager en BD
  async create(createManagerDto: CreateManagerDto) {
    const {
      username,
      email,
      password,
      firstname,
      lastname,
      phone,
      address,
      is_admin,
    } = createManagerDto;

    // verifier si le mot de passe fait au moins 6 caractères
    if (password.length < 6)
      throw new ConflictException('Le mot de passe doit faire au moins 6 caractères.');

    // verifier si l'email n'est pas déjà utilisé
    if (email) {
      const manager = await this.findManager({ email: email });
      if (manager) throw new ConflictException("Cet email est déjà utilisé par un manager.");
      const seller = await this.prismaService.seller.findUnique({where: { email: email },});
      if (seller) throw new ConflictException("Cet email est déjà utilisé par un vendeur.");
    }

    // vérifier si le pseudo n'est pas déjà utilisé
    if (username) {
      const manager = await this.findManager({ username: username });
      if (manager) throw new ConflictException("Ce pseudo est déjà utilisé.");
      const seller = await this.prismaService.seller.findUnique({where: { username: username },});
      if (seller) throw new ConflictException("Ce pseudo est déjà utilisé par un vendeur.");
    }

    // vérifier si le téléphone n'est pas déjà utilisé
    if (phone) {
      const manager = await this.prismaService.manager.findUnique({where: { phone: phone },});
      if (manager) throw new ConflictException("Ce numéro de téléphone est déjà utilisé par un manager.");
      const seller = await this.prismaService.seller.findUnique({where: { phone: phone },});
      if (seller) throw new ConflictException("Ce numéro de téléphone est déjà utilisé par un vendeur.");
    }

    //hasher mot de passe
    const salt = uuid();
    const hash = await bcrypt.hash(password + salt, 10);

    // enregistrer manager en BD
    await this.prismaService.manager.create({
      data: {
        username,
        email,
        password: hash,
        password_salt: salt,
        firstname,
        lastname,
        phone,
        address,
        is_admin,
      },
    });

    // retourner réponse de succès
    return { data: 'Manager créé avec succès !' };
  }

  // supprimer un manager
  async delete(id_manager: string) {
    // verifier que le manager existe
    const manager = await this.findManager({ id_manager: id_manager });
    if (!manager) throw new NotFoundException("Ce manager n'existe pas.");
    await this.prismaService.manager.delete({
      where: {
        id_manager,
      },
    });
    return { data: 'Manager supprimé !' };
  }

  // modifier un manager
  async update(
    id_manager: string,
    updateManagerDto: UpdateManagerDto,
    asker_id: string,
  ) {
    // verifier que le manager existe
    const manager = await this.findManager({ id_manager: id_manager });
    if (!manager) throw new NotFoundException("Ce manager n'existe pas.");
    // si demandeur pas propriétaire du compte
    if (asker_id !== id_manager) {
      //récupérer infos demandeur
      const asker = await this.findManager({ id_manager: asker_id });
      // si demandeur n'est pas admin
      if (!asker.is_admin)
        throw new UnauthorizedException('Opération interdite');
    }
    // verifier si l'email n'est pas déjà utilisé
    const managerEmail = await this.prismaService.manager.findUnique({where: { email: updateManagerDto.email, NOT: { id_manager: id_manager } },});
    if (managerEmail) throw new ConflictException("Cet email est déjà utilisé par un manager.");
    const sellerEmail = await this.prismaService.seller.findUnique({where: { email: updateManagerDto.email, NOT: { id_seller: id_manager } },});
    if (sellerEmail) throw new ConflictException("Cet email est déjà utilisé par un vendeur.");
    

    // verifier si le pseudo n'est pas déjà utilisé
    const managerUsername = await this.prismaService.manager.findUnique({where: { username: updateManagerDto.username, NOT: { id_manager: id_manager } },});
    if (managerUsername) throw new ConflictException("Ce pseudo est déjà utilisé.");
    const sellerUsername = await this.prismaService.seller.findUnique({where: { username: updateManagerDto.username, NOT: { id_seller: id_manager } },});
    if (sellerUsername) throw new ConflictException("Ce pseudo est déjà utilisé par un vendeur.");

    // verifier si le téléphone n'est pas déjà utilisé
    const managerPhone = await this.prismaService.manager.findUnique({where: { phone: updateManagerDto.phone, NOT: { id_manager: id_manager } },});
    if (managerPhone) throw new ConflictException("Ce numéro de téléphone est déjà utilisé par un manager.");
    const sellerPhone = await this.prismaService.seller.findUnique({where: { phone: updateManagerDto.phone, NOT: { id_seller: id_manager } },});
    if (sellerPhone) throw new ConflictException("Ce numéro de téléphone est déjà utilisé par un vendeur.");
    
    // appliquer modifications
    await this.prismaService.manager.update({
      where: {
        id_manager,
      },
      data: {
        ...updateManagerDto,
      },
    });
    return { data: 'Manager mis à jour !' };
  }

  async updatePassword(userId: string, updatePasswordDto: UpdatePasswordDto) {
    // verifier que l'ancien mot de passe est correct
    const {oldPassword, newPassword} = updatePasswordDto;
    const manager = await this.findManager({ id_manager: userId });
    if (!manager) throw new NotFoundException("Ce manager n'existe pas.");
    if (!(await this.validatePassword(oldPassword, manager.password_salt, manager.password)))
      throw new UnauthorizedException("Mot de passe incorrect.");
    // verifier que le nouveau mot de passe fait au moins 4 caractères
    if (newPassword.length < 4)
      throw new ConflictException('Le mot de passe doit faire au moins 4 caractères.');
    // hasher le nouveau mot de passe
    const salt = uuid();
    const hash = await bcrypt.hash(newPassword + salt, 10);
    // mettre à jour le mot de passe
    await this.prismaService.manager.update({
      where: {
        id_manager: userId,
      },
      data: {
        password: hash,
        password_salt: salt,
      },
    });
    return { data: 'Mot de passe mis à jour !' };
  }

  // supprimer plusieurs managers
  async deleteMany(ids: string[]) {
    // verifier que ids est fourni
    if (ids == undefined)
      throw new NotFoundException("Vous devez fournir une liste d'ids de managers.");
    // verifier que les managers existent
    for (let id of ids) {
      const manager = await this.findManager({ id_manager: id });
      if (!manager) throw new NotFoundException("Le manager avec l'id " + id + " n'existe pas.");
    }
    // supprimer les managers dans la base de données
    await this.prismaService.manager.deleteMany({
      where: {
        id_manager: {
          in: ids,
        },
      },
    });
    return { data: 'Managers supprimés !' };
  }
}
