import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsOptional()
  description: string;

  @IsOptional()
  image: string;

  @IsOptional()
  category: string;
}
