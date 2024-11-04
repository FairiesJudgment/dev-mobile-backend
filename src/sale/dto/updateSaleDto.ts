import { Type } from "class-transformer";
import { IsDate, IsNotEmpty, IsOptional } from "class-validator";
import { PaymentMethod } from '@prisma/client'

type GameSold = {
    id_game : number;
    tags : string[];
    quantity : number;
}
export class UpdateSaleDto {
    @IsOptional()
    @IsDate()
    @Type(() => Date)
    readonly date : Date;
    @IsOptional()
    @IsNotEmpty()
    amount : number;
    @IsOptional()
    @IsNotEmpty()
    comission : number;
    @IsOptional()
    @IsNotEmpty()
    payment_method : PaymentMethod;
    @IsOptional()
    @IsNotEmpty()
    id_seller : string;
    @IsOptional()
    @IsNotEmpty()
    id_client : number;
    @IsOptional()
    @IsNotEmpty()
    id_session : number;
    // si aucune modif pour games_sold S'ASSURER que ce n'est pas envoyé
    // si modif partielle envoyer nouvelles + anciennes données à garder
    // car on supprime puis recrée les relations en bd, pas de réel update
    @IsOptional()
    @IsNotEmpty()
    games_sold : GameSold[];
}