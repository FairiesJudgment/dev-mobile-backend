import { IsNotEmpty } from "class-validator";
import { CustomIsEmail } from "src/common/decorators/CustomIsEmail";

export class LoginDto {
    @CustomIsEmail()
    readonly email : string
    @IsNotEmpty()
    readonly password : string
}