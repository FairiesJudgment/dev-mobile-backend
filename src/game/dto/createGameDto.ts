import { IsNotEmpty, IsInt, Min } from "class-validator";

export class CreateGameDto {

    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    description?: string;

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
    id_editor: string;

    @IsNotEmpty()
    id_category: string;
}