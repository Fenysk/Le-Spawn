import { IsNotEmpty, IsOptional } from "class-validator";
import { StatType } from "../enums/stat-type.enum";

export class GetStatisticDto {
    @IsNotEmpty()
    type: StatType;

    @IsOptional()
    userId?: string;
}
