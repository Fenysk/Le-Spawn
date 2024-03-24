import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateItemDto {
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    platformId: string;

    @IsNotEmpty()
    description: string;

    @IsNotEmpty()
    edition: string;

    @IsNotEmpty()
    region: string;

    @IsNotEmpty()
    hasBox: boolean;

    @IsNotEmpty()
    stateBox: string | null;
    
    @IsNotEmpty()
    hasGame: boolean;

    @IsNotEmpty()
    stateGame: string | null;

    @IsNotEmpty()
    extraContent: {
        name: string;
        type: string;
        state: string;
    }[] | null;

    @IsNotEmpty()
    images: string[];

    @IsNotEmpty()
    @IsNumber()
    price: number;

    @IsOptional()
    isVisible: boolean;
}
