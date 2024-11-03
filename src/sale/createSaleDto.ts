import { Type } from "class-transformer";
import { IsDate, IsNotEmpty } from "class-validator";

type GameSold = {
    id_game : number;
    tags : string[];
    quantity : number;
}

enum PaymentMethod {
    "cash",
    "credit_card",
    "check"
}

export class CreateSaleDto {
    @IsDate()
    @Type(() => Date)
    readonly date : Date;
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
    games_sold : GameSold[];
}