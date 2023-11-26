import { IsOptional, IsNumber } from 'class-validator';

export class UpdateProductDto {
  @IsOptional()
  title: string;

  @IsOptional()
  @IsNumber()
  price: number;

  @IsOptional()
  description: string;

  @IsOptional()
  image: string;

  @IsOptional()
  category: string;
}
