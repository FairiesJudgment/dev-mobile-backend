import { IsString, IsOptional } from 'class-validator';

export class UpdateGameCategoryDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;
}