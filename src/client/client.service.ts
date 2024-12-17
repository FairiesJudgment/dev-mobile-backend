import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateClientDto } from './dto/createClientDto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateClientDto } from './dto/updateClientDto';

@Injectable()
export class ClientService {
    constructor(private readonly prismaService: PrismaService) {}

    async findClient(options: {
        email?: string;
        phone?: string;
        id_client?: number;
    }) {
        const { email, phone, id_client } = options;
        if (!email && !id_client && !phone) {
        throw new Error(
            'Vous devez fournir au moins un élément parmi un email, un id ou un pseudo.',
        );
        }

    const client = await this.prismaService.client.findUnique({
      where: email ? { email } : id_client ? { id_client } : { phone },
    });

    return client;
    }

    async getAll() {
        return await this.prismaService.client.findMany();
    }

    async get(id_client: number) {
        // vérifier si client existe
        const client = await this.findClient({id_client : id_client});
        if (!client) throw new NotFoundException("Ce client n'existe pas.");

        //si client existe
        return client;
    }

    async create(createClientDto: CreateClientDto) {
        const {
            firstname,
            lastname,
            email,
            phone,
            address
        } = createClientDto;
        //verifier si l'email existe déjà
        const client = await this.findClient({ email: createClientDto.email });
        if (client) throw new ConflictException("Cet email est déjà utilisé.");
        // Verifier si le numéro de téléphone existe déjà
        const clientPhone = await this.findClient({ phone: createClientDto.phone });
        if (clientPhone) throw new ConflictException("Ce numéro de téléphone est déjà utilisé.")

        // créer client
        await this.prismaService.client.create({
        data: {
            firstname,
            lastname,
            email,
            phone,
            address,
        },
        });

        return { data: 'Client créé avec succès !' };
    }

    async update(id_client: number, updateClientDto: UpdateClientDto) {
        // Verifier si l'email existe déjà
        const clientEmail = await this.prismaService.client.findUnique({where : {email : updateClientDto.email, NOT : {id_client : id_client}}});
        if (clientEmail) throw new ConflictException("Cet email est déjà utilisé.");

        // Verifier si le numéro de téléphone existe déjà
        const clientPhone = await this.prismaService.client.findUnique({where : {phone : updateClientDto.phone, NOT : {id_client : id_client}}});
        if (clientPhone) throw new ConflictException("Ce numéro de téléphone est déjà utilisé.");

        // mettre à jour le client
        await this.prismaService.client.update({
            where : {
                id_client,
            },
            data : {
                ...updateClientDto,
            },
        });

        return { data : 'Client mis à jour !'};
    }

    async delete(id_client: number) {
        // verifier que le client existe 
        const client = await this.findClient({ id_client : id_client });
        if (!client) throw new NotFoundException("Ce client n'existe pas.");

        // supprimer le client
        await this.prismaService.client.delete({
            where : {
                id_client,
            },
        });

        return { data : 'Client supprimé !'};
    }
}
