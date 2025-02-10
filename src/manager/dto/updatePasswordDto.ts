import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { CustomIsEmail } from "src/common/decorators/CustomIsEmail";
import { CustomIsPhoneNumber } from "src/common/decorators/CustomIsPhoneNumber";
import { IsUsername } from "src/common/decorators/IsUsername";

export class UpdatePasswordDto {
    @IsNotEmpty()
    oldPassword : string;
    @IsNotEmpty()
    newPassword : string;
}