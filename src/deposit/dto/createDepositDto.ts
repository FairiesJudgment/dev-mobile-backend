import { Type } from "class-transformer";
import { IsDate, IsNotEmpty, IsOptional } from "class-validator";

type GamesDeposited = {
    id_game : number;
    quantity : number;
    price : number;
    nb_for_sale : number;
}
export class CreateDepositDto {
    @IsOptional()
    @IsDate()
    @Type(() => Date)
    readonly date : Date;
    @IsNotEmpty()
    amount : number;
    @IsNotEmpty()
    fees : number;
    @IsNotEmpty()
    discount : number;
    @IsNotEmpty()
    id_seller : string;
    @IsNotEmpty()
    id_session : number;
    @IsNotEmpty()
    games_deposited : GamesDeposited[];
}