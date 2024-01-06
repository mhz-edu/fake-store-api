import { Injectable, NotFoundException } from '@nestjs/common';
import { CartRepository } from './cart.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCartDto } from './dto/create-cart.dto';
import { CartsQueryDto } from './dto/query.dto';
import { EditCartDto } from './dto/edit-cart.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(CartRepository)
    private cartRepository: CartRepository,
  ) {}

  async createCart(createCartDto: CreateCartDto) {
    return this.cartRepository.createCart(createCartDto);
  }

  async getCart(id: number) {
    return this.cartRepository.findOne({ where: { id } });
  }

  async getCarts(queryOptions?: CartsQueryDto, userId?: number) {
    return this.cartRepository.getCarts(userId, queryOptions);
  }

  async editCart(cartId: number, editCartDto: EditCartDto) {
    return this.cartRepository.editCart(cartId, editCartDto);
  }

  async deleteCart(cartId: number) {
    return await this.cartRepository.deleteCart(cartId);
  }
}
