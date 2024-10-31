import { IsNotEmpty, IsOptional } from "class-validator";
import { CustomIsEmail } from "src/common/decorators/CustomIsEmail";
import { CustomIsPhoneNumber } from "src/common/decorators/CustomIsPhoneNumber";

export class UpdateClientDto {
    @IsOptional()
    @IsNotEmpty()
    firstname : string;
    @IsOptional()
    @IsNotEmpty()
    lastname : string;
    @IsOptional()
    @CustomIsEmail()
    email : string;
    @IsOptional()
    @CustomIsPhoneNumber()
    phone : string;
    @IsOptional()
    @IsNotEmpty()
    address : string;
}