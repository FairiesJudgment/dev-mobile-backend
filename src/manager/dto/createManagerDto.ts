import { IsEmail, IsNotEmpty, IsOptional } from "class-validator";
import { IsPhoneNumber } from "src/common/decorators/IsPhoneNumber";

export class CreateManagerDto {
    @IsNotEmpty()
    readonly username : string;
    @IsEmail()
    readonly email : string;
    @IsNotEmpty()
    readonly password : string;
    @IsNotEmpty()
    readonly firstname : string;
    @IsNotEmpty()
    readonly lastname : string;
    @IsPhoneNumber()
    readonly phone : string;
    @IsOptional()
    readonly address : string;
    @IsNotEmpty()
    readonly isAdmin : boolean;
}