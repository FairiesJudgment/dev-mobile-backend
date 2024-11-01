import { IsString, IsBoolean, IsInt, IsUUID, IsOptional, IsNumber } from 'class-validator';

export class UpdateDepositedGameDto {
  @IsUUID()
  @IsOptional()
  tag?: string;

  @IsNumber()
  @IsOptional()
  price?: number;

  @IsBoolean()
  @IsOptional()
  sold?: boolean;

  @IsBoolean()
  @IsOptional()
  for_sale?: boolean;

  @IsInt()
  @IsOptional()
  id_session?: number;

  @IsString()
  @IsOptional()
  id_seller?: string;

  @IsInt()
  @IsOptional()
  id_game?: number;
}