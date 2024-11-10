import { Type } from "class-transformer";
import { IsDate, IsNotEmpty, IsOptional } from "class-validator";

// on peut modifier les attributs du recover
// mais les jeux deposés sont déjà supprimés 
// donc pas de modif à ce niveau
export class UpdateRecoverDto {
    @IsOptional()
    @IsDate()
    @Type(() => Date)
    readonly date : Date;
    @IsOptional()
    @IsNotEmpty()
    amount : number;
    @IsOptional()
    @IsNotEmpty()
    id_seller : string;
    @IsOptional()
    @IsNotEmpty()
    id_session : number;
}