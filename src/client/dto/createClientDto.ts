import { IsNotEmpty, IsOptional } from "class-validator";
import { CustomIsEmail } from "src/common/decorators/CustomIsEmail";
import { CustomIsPhoneNumber } from "src/common/decorators/CustomIsPhoneNumber";

export class CreateClientDto {
    @IsNotEmpty()
    firstname : string;
    @IsNotEmpty()
    lastname : string;
    @CustomIsEmail()
    @IsNotEmpty()
    email : string;
    @CustomIsPhoneNumber()
    @IsNotEmpty()
    phone : string;
    @IsOptional()
    address : string;
}