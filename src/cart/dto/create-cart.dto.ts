import { IsNotEmpty, IsNumberString, IsOptional } from 'class-validator';

export class CreateCartDto {
  @IsNotEmpty()
  userId: number;

  products: {
    productId: number;
    quantity: number;
  }[];
}
