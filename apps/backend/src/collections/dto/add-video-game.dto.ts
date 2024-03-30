import { Currency, State } from "@prisma/client";
import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsUrl } from "class-validator";

export class AddVideoGameDto {

    @IsNotEmpty()
    collectionId: string;

    @IsNotEmpty()
    title: string;

    @IsOptional()
    description: string;

    @IsOptional()
    edition: string;

    @IsOptional()
    region: string;

    @IsOptional()
    tags: string[];

    @IsOptional()
    @IsNumber()
    ageRating: number;

    @IsOptional()
    editor: string;

    @IsOptional()
    developer: string;

    @IsOptional()
    @IsDateString()
    releaseDate: Date;

    @IsOptional()
    @IsNumber()
    maxMultiplayerLocalPlayers: number;

    @IsOptional()
    @IsNumber()
    maxMultiplayerOnlinePlayers: number;

    @IsNotEmpty()
    @IsUrl()
    mainPhoto: string;

    @IsOptional()
    stateBox: State;

    @IsOptional()
    photosBox: string[];
    
    @IsOptional()
    stateGame: State;

    @IsOptional()
    photosGame: string[];

    @IsOptional()
    extraContents: ExtraContent[];

    @IsOptional()
    initialPurchasePrice: number;

    @IsOptional()
    negotiatedPurchasePrice: number;

    @IsOptional()
    estimatedPrice: number;

    @IsOptional()
    currency: Currency;

    @IsNotEmpty()
    platformId: string;

}

class ExtraContent {
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    type: string;

    @IsNotEmpty()
    state: string;

    @IsOptional()
    photos: string[];
}
