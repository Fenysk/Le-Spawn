import { State } from "@prisma/client";
import { IsDateString, IsNotEmpty, IsNumber, IsOptional } from "class-validator";

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

    @IsOptional()
    stateBox: State;

    @IsOptional()
    photoFrontBox: string;

    @IsOptional()
    photoBackBox: string;

    @IsOptional()
    photoSideBox: string;

    @IsOptional()
    photoInsideBox: string;

    @IsOptional()
    stateGame: State;

    @IsOptional()
    photoFrontGame: string;

    @IsOptional()
    photoBackGame: string;

    @IsOptional()
    extraContents: ExtraContent[];

    @IsOptional()
    initialPurchasePrice: number;

    @IsOptional()
    negotiatedPurchasePrice: number;

    @IsOptional()
    estimatedPrice: number;

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
}
