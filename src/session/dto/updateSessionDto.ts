import { Type } from "class-transformer";
import { IsDate, IsNotEmpty, IsOptional } from "class-validator";

export class UpdateSessionDto {
    @IsOptional()
    @IsDate()
    @Type(() => Date)
    date_begin : Date;
    @IsOptional()
    @IsDate()
    @Type(() => Date)
    date_end : Date;
    @IsOptional()
    @IsNotEmpty()
    deposit_fees : number;
    @IsOptional()
    @IsNotEmpty()
    discount : number;
    @IsOptional()
    @IsNotEmpty()
    comission_fees : number;

}