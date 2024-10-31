import { IsNotEmpty, IsOptional } from "class-validator";
import { CustomIsEmail } from "src/common/decorators/CustomIsEmail";
import { CustomIsPhoneNumber } from "src/common/decorators/CustomIsPhoneNumber";

export class CreateClientDto {
    @IsNotEmpty()
    firstname : string;
    @IsNotEmpty()
    lastname : string;
    @CustomIsEmail()
    email : string;
    @CustomIsPhoneNumber()
    phone : string;
    @IsOptional()
    @IsNotEmpty()
    address : string;
}