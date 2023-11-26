import { IsNotEmpty, IsNumberString, IsOptional } from 'class-validator';

export class EditCartDto {
  @IsNotEmpty()
  userId: number;

  date: string;

  products: {
    productId: number;
    quantity: number;
  }[];
}
