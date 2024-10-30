import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateGameEditorDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description: string;
}