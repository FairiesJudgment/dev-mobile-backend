import { Type } from "class-transformer";
import { IsDate, IsNotEmpty, IsOptional } from "class-validator";
import { PaymentMethod } from '@prisma/client'

type GameSold = {
    id_game : number;
    tags?: string[];
    quantity : number;
}
export class CreateSaleDto {
    @IsOptional()
    @IsDate()
    @Type(() => Date)
    readonly date : Date;
    @IsOptional()
    @IsNotEmpty()
    amount : number;
    @IsNotEmpty()
    comission : number;
    @IsNotEmpty()
    payment_method : PaymentMethod;
    @IsNotEmpty()
    id_seller : string;
    @IsNotEmpty()
    id_client : number;
    @IsNotEmpty()
    id_session : number;
    @IsNotEmpty()
    games_sold : GameSold[];
}