import { ConflictException, Injectable } from '@nestjs/common';
import { CreateManagerDto } from './dto/createManagerDto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { uuid } from 'uuidv4';

@Injectable()
export class ManagerService {
    constructor(private readonly prismaService : PrismaService) {}

    // trouver un manager selon son email
    async findManager(email : string) {
        const manager = await this.prismaService.manager.findUnique({
            where : {
                email,
            }
        });
        return manager;
    }

    // enregistrer un manager en BD
    async create(createManagerDto: CreateManagerDto) {
        const {username, email, password, firstname, lastname, phone, address, isAdmin} = createManagerDto;

        //verifier si manager existe déjà
        const manager = this.findManager(email);
        if (manager) throw new ConflictException("Ce manager existe déjà !")
        
        //hasher mot de passe
        const salt = uuid();
        const hash = await bcrypt.hash(password + salt, 10);

        // enregistrer manager en BD
        await this.prismaService.manager.create({
            data : {
                username,
                email,
                password : hash,
                password_salt : salt,
                firstname,
                lastname,
                phone,
                address,
                is_admin : isAdmin,
            }
        });

        // retourner réponse de succès
        return { data : "Manager créé avec succès" };
    }
}
