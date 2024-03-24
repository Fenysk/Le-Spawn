import { Country } from "@prisma/client";
import { IsNotEmpty, IsOptional } from "class-validator";

export class CreateAddressDto {
    @IsNotEmpty()
    numberAndStreet: string;

    @IsNotEmpty()
    city: string;

    @IsNotEmpty()
    zipCode: string;

    @IsNotEmpty()
    state: string;

    @IsNotEmpty()
    country: Country;

    @IsNotEmpty()
    phoneNumber: string;

    @IsOptional()
    setDefault: boolean;
}
