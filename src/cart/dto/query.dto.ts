import { IsNumber, IsOptional } from 'class-validator';

export class CartsQueryDto {
  @IsOptional()
  @IsNumber()
  limit: number;

  @IsOptional()
  sort: string;

  @IsOptional()
  startdate: string;

  @IsOptional()
  enddate: string;
}
