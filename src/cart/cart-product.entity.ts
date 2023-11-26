import { Product } from '../products/product.entity';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Cart } from './cart.entity';
import { Exclude } from 'class-transformer';

@Entity()
@Unique('UQ_CARTPROD', ['cartId', 'productId'])
export class CartToProduct extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Exclude()
  id: number;

  @Column()
  @Exclude()
  cartId: number;

  @Column()
  productId: number;

  @Column()
  quantity: number;

  @ManyToOne(() => Cart, (cart) => cart.cartToProduct, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'cartId' })
  cart: Cart;

  @ManyToOne(() => Product, (product) => product.cartToProduct)
  @JoinColumn({ name: 'productId' })
  product: Product;
}
