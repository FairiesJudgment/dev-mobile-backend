import { IsNotEmpty, IsInt, Min, IsString } from "class-validator";

export class CreateGameDto {

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    description: string;

    @IsInt()
    @Min(1)
    min_players: number;
    
    @IsInt()
    @Min(1)
    max_players: number;
    
    @IsInt()
    @Min(0)
    min_age: number;
    
    @IsInt()
    @Min(0)
    max_age: number;
    
    @IsNotEmpty()
    @IsInt()
    id_editor: number;
    
    @IsNotEmpty()
    @IsInt()
    id_category: number;
}