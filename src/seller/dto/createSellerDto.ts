import { IsNotEmpty, IsOptional } from "class-validator";
import { CustomIsEmail } from "src/common/decorators/CustomIsEmail";
import { CustomIsPhoneNumber } from "src/common/decorators/CustomIsPhoneNumber";
import { IsUsername } from "src/common/decorators/IsUsername";

export class CreateSellerDto {
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
    @IsOptional()
    @CustomIsPhoneNumber()
    readonly phone : string;
    @IsOptional()
    @IsNotEmpty()
    readonly address : string;
}