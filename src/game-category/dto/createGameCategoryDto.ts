import { IsNotEmpty, IsString } from 'class-validator';

export class CreateGameCategoryDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;
}