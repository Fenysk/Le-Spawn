import { IsNotEmpty, IsOptional } from "class-validator";
import { StatType } from "../enums/stat-type.enum";

export class AddNewStatisticDto {
    @IsNotEmpty()
    type: StatType;

    @IsOptional()
    value?: number;
}
