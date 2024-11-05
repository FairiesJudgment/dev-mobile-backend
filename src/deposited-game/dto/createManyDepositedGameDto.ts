import { IsString, IsBoolean, IsInt, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateManyDepositedGameDto {
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @IsNumber()
  @IsNotEmpty()
  number_for_sale: number;

  @IsString()
  @IsNotEmpty()
  id_seller: string;

  @IsInt()
  @IsNotEmpty()
  id_game: number;
}