import { IsInt, Min, IsOptional, IsString } from "class-validator";

export class UpdateGameDto {
    
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsString()
    image: string;

    @IsOptional()
    @IsInt()
    @Min(1)
    min_players?: number;

    @IsOptional()
    @IsInt()
    @Min(1)
    max_players?: number;

    @IsOptional()
    @IsInt()
    @Min(0)
    min_age?: number;
    
    @IsOptional()
    @IsInt()
    @Min(0)
    max_age?: number;

    @IsOptional()
    @IsInt()
    id_editor?: number;

    @IsOptional()
    @IsInt()
    id_category?: number;
}