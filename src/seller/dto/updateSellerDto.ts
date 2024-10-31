import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { CustomIsEmail } from "src/common/decorators/CustomIsEmail";
import { CustomIsPhoneNumber } from "src/common/decorators/CustomIsPhoneNumber";
import { IsUsername } from "src/common/decorators/IsUsername";

export class UpdateSellerDto {
    @IsOptional()
    @IsUsername()
    readonly username : string;
    @IsOptional()
    @CustomIsEmail()
    readonly email : string;
    @IsOptional()
    @IsNotEmpty()
    readonly firstname : string;
    @IsOptional()
    @IsNotEmpty()
    readonly lastname : string;
    @IsOptional()
    @CustomIsPhoneNumber()
    readonly phone : string;
    @IsOptional()
    @IsString()
    readonly address : string;
}