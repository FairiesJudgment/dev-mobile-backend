import { Type } from "class-transformer";
import { IsDate, IsNotEmpty, IsOptional } from "class-validator";

type GamesRecovered = {
    id_game : number;
    quantity : number;
}

export class CreateRecoverDto {
    @IsOptional()
    @IsDate()
    @Type(() => Date)
    readonly date : Date;
    @IsNotEmpty()
    amount : number;
    @IsNotEmpty()
    id_seller : string;
    @IsNotEmpty()
    id_session : number;
    @IsNotEmpty()
    games_recovered : GamesRecovered[];
}