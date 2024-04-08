import { IsEmail, IsNotEmpty, MinLength } from "class-validator";

export class RegisterDto {
    @IsNotEmpty()
    @IsEmail()
    readonly email: string;

    @IsNotEmpty()
    @MinLength(3)
    readonly password: string;

    @IsNotEmpty()
    @MinLength(3)
    readonly nickName: string;

    @IsNotEmpty()
    readonly betaCode: string;
}
