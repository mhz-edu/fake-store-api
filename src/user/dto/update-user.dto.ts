import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  avatar: string;

  @IsOptional()
  phone: string;

  @IsOptional()
  name: object;

  @IsOptional()
  address: object;
}
