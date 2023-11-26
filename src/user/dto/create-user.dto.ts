import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  username: string;

  @IsOptional()
  avatar: string;

  @IsOptional()
  phone: string;

  @IsOptional()
  name: object;

  @IsOptional()
  address: object;
}
