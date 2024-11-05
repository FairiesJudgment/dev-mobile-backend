import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateSessionDto } from './dto/createSessionDto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateSessionDto } from './dto/updateSessionDto';

@Injectable()
export class SessionService {
    constructor(private readonly prismaService : PrismaService) {}

    async findSession(id_session : number) {
        const session = this.prismaService.session.findUnique({
            where: {
                id_session,
            },
        });
        return session;
    }


    // vérifie qu'une nouvelle session ne chevauche pas une ancienne
    // entrée : sessions existantes, dateb debut et date fin nouvelle session
    // sortie : vrai si chevauchement, faux sinon
    private isConflict(sessions, date_begin: Date, date_end: Date): boolean {
        return sessions.some((session) => {
            // Convert session dates to Date instances for comparison
            const sessionBegin = new Date(session.date_begin).getTime();
            const sessionEnd = new Date(session.date_end).getTime();
            const dateBegin = date_begin.getTime();
            const dateEnd = date_end.getTime();
            
            return (
                (dateBegin >= sessionBegin && dateBegin <= sessionEnd) ||
                (dateEnd >= sessionBegin && dateEnd <= sessionEnd) ||
                (dateBegin <= sessionBegin && dateEnd >= sessionEnd)
            );
        });
    }
    
    // recupere une session ouverte actuallement
    async getOpened() {
        const now = new Date();
        const session = await this.prismaService.session.findFirst({
            where: {
                date_begin: { lte: now },
                date_end: { gte: now },
            },
        });
        if (!session) throw new NotFoundException("Aucune session ouverte actuellement.");

        return session;
    }

    async get(id_session: number) {
        const session = await this.findSession(id_session);

        if (!session) throw new NotFoundException("Cette session n'existe pas.");

        return session;
    }

    async getAll() {
        return await this.prismaService.session.findMany();
    }


    async create(createSessionDto: CreateSessionDto) {
        const {date_begin, date_end} = createSessionDto;
        // récupérer toutes les sessions existantes
        const sessions = await this.prismaService.session.findMany();
        // vérifier que nouvelle session ne se chevauche pas une autre
        if (this.isConflict(sessions, date_begin, date_end)) throw new ConflictException("Il ne peut y avoir qu'une seule session ouverte à la fois.");
        // verifier qu'un name n'est pas déjà utilisé
        const session = await this.prismaService.session.findFirst({
            where: {
                name : createSessionDto.name,
            },
        });
        if (session) throw new ConflictException("Ce nom de session est déjà utilisé.");


        await this.prismaService.session.create({
            data : {
                ...createSessionDto,
            },
        });

        return {data : "Session créée avec succès !"};
    }

    async update(updateSessionDto: UpdateSessionDto, id_session: number) {
        // verifier que la session exsite
        const session = await this.findSession(id_session);
        if (!session) throw new NotFoundException("Cette session n'existe pas.");

        // récupérer nouvelles dates si elles existent
        const newDateBegin = updateSessionDto.date_begin || session.date_begin;
        const newDateEnd = updateSessionDto.date_end || session.date_end;

        // vérifier la validité des nouvelles dates
        const sessions = await this.prismaService.session.findMany({
            where: {
                id_session : { not : id_session},
            },
        });
        // vérifier que nouvelle session ne se chevauche pas une autre
        if (this.isConflict(sessions, newDateBegin, newDateEnd)) throw new ConflictException("Il ne peut y avoir qu'une seule session ouverte à la fois.");

        // verifier qu'un name n'est pas déjà utilisé
        const sessionName = await this.prismaService.session.findFirst({
            where: {
                name : updateSessionDto.name,
            },
        });
        if (sessionName) throw new ConflictException("Ce nom de session est déjà utilisé.");

        await this.prismaService.session.update({
            where: {
                id_session,
            },
            data : {
                ...updateSessionDto,
            },
        });

        return { data : 'Session modifiée avec succès !' };
    }

    async delete(id_session: number) {
        // verifier que la session exsite
        const session = await this.findSession(id_session);
        if (!session) throw new NotFoundException("Cette session n'existe pas.");

        await this.prismaService.session.delete({
            where : { id_session },
        });

        return { data : 'Session supprimée avec succès !'};
    }
}
