import { Type } from "class-transformer";
import { IsDate, IsNotEmpty, IsOptional } from "class-validator";

export class UpdateDepositDto {
    @IsOptional()
    @IsDate()
    @Type(() => Date)
    readonly date : Date;
    @IsOptional()
    @IsNotEmpty()
    amount : number;
    @IsOptional()
    @IsNotEmpty()
    fees : number;
    @IsOptional()
    @IsNotEmpty()
    discount : number;
    @IsOptional()
    @IsNotEmpty()
    id_seller : string;
    @IsOptional()
    @IsNotEmpty()
    id_session : number;
    // si modif des jeux déposés alors supprimer transaction
    // puis la recréer
}