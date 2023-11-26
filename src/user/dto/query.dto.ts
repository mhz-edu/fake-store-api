import { IsNumber, IsOptional } from 'class-validator';

export class UsersQueryDto {
  @IsOptional()
  @IsNumber()
  limit: number;

  @IsOptional()
  sort: string;
}
