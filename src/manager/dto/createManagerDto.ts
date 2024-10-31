import { IsNotEmpty, IsOptional } from "class-validator";
import { CustomIsEmail } from "src/common/decorators/CustomIsEmail";
import { CustomIsPhoneNumber } from "src/common/decorators/CustomIsPhoneNumber";
import { IsUsername } from "src/common/decorators/IsUsername";

export class CreateManagerDto {
    @IsUsername()
    readonly username : string;
    @CustomIsEmail()
    readonly email : string;
    @IsNotEmpty()
    readonly password : string;
    @IsNotEmpty()
    readonly firstname : string;
    @IsNotEmpty()
    readonly lastname : string;
    @CustomIsPhoneNumber()
    readonly phone : string;
    @IsOptional()
    readonly address : string;
    @IsNotEmpty()
    readonly is_admin : boolean;
}