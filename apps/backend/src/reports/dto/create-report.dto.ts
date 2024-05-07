import { IsArray, IsNotEmpty, IsOptional } from "class-validator";

export class CreateReportDto {
    @IsNotEmpty()
    subject: string;

    @IsNotEmpty()
    message: string;

    @IsArray()
    @IsOptional()
    photosUrls: string[];
}
