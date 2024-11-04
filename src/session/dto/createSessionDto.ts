import { Type } from "class-transformer";
import { IsDate, IsNotEmpty } from "class-validator";

export class CreateSessionDto {
    @IsNotEmpty()
    name : string;
    @IsDate()
    @Type(() => Date)
    date_begin : Date;
    @IsDate()
    @Type(() => Date)
    date_end : Date;
    @IsNotEmpty()
    deposit_fees : number;
    @IsNotEmpty()
    discount : number;
    @IsNotEmpty()
    comission_fees : number;

}