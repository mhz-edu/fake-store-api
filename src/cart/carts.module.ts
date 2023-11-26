import { Module } from '@nestjs/common';
import { CartService } from './carts.service';
import { CartController } from './carts.controller';
import { CartRepository } from './cart.repository';

@Module({
  providers: [CartService, CartRepository],
  controllers: [CartController],
})
export class CartModule {}
