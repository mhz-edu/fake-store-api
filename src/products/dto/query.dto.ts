import { IsNumber, IsOptional } from 'class-validator';

export class ProductsQueryDto {
  @IsOptional()
  @IsNumber()
  limit: number;

  @IsOptional()
  sort: string;
}
