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
        //verifier si client existe déjà
        const client = await this.findClient({ email: createClientDto.email });
        if (client) throw new ConflictException("Ce client existe déjà.")

        // créer client
        await this.prismaService.client.create({
        data: {
            ...createClientDto,
        },
        });

        return { data: 'Client créé avec succès !' };
    }

    async update(id_client: number, updateClientDto: UpdateClientDto) {
        // verifier que le client existe
        const client = await this.findClient({ id_client : id_client });
        if (!client) throw new NotFoundException("Ce client n'existe pas.");

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
