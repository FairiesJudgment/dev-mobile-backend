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

  async getAll() {
    return await this.prismaService.manager.findMany();
  }

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
    if (updateManagerDto.email) {
      const manager = await this.findManager({ email: updateManagerDto.email });
      if (manager) throw new ConflictException("Cet email est déjà utilisé par un manager.");
      const seller = await this.prismaService.seller.findUnique({where: { email: updateManagerDto.email },});
      if (seller) throw new ConflictException("Cet email est déjà utilisé par un vendeur.");
    }

    // verifier si le pseudo n'est pas déjà utilisé
    if (updateManagerDto.username) {
      const manager = await this.findManager({ username: updateManagerDto.username });
      if (manager) throw new ConflictException("Ce pseudo est déjà utilisé.");
      const seller = await this.prismaService.seller.findUnique({where: { username: updateManagerDto.username },});
      if (seller) throw new ConflictException("Ce pseudo est déjà utilisé par un vendeur.");
    }
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
}
