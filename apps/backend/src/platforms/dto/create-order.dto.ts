import { GameSupportType } from "@prisma/client";
import { IsDateString, IsNotEmpty } from "class-validator";

export class CreatePlatformDto {
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    shortName: string;

    @IsNotEmpty()
    gameSupportType: GameSupportType;

    @IsNotEmpty()
    generation: number;

    @IsNotEmpty()
    manufacturer: string;

    @IsNotEmpty()
    @IsDateString()
    releaseDate: string;


    
    @IsNotEmpty()
    squareLogoUrl: string;

    @IsNotEmpty()
    rectangleLogoUrl: string;

    @IsNotEmpty()
    pictureUrl: string;
}
