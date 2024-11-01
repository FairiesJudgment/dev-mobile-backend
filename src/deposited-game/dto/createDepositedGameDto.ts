import { IsString, IsBoolean, IsInt, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateDepositedGameDto {
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsBoolean()
  @IsNotEmpty()
  sold: boolean;

  @IsBoolean()
  @IsNotEmpty()
  for_sale: boolean;

  @IsInt()
  @IsNotEmpty()
  id_session: number;

  @IsString()
  @IsNotEmpty()
  id_seller: string;

  @IsInt()
  @IsNotEmpty()
  id_game: number;
}