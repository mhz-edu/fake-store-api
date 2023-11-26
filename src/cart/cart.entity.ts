import { User } from '../user/user.entity';
import {
  BaseEntity,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CartToProduct } from './cart-product.entity';
import { Expose, Transform } from 'class-transformer';

@Entity()
export class Cart extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  date: Date;

  @ManyToOne(() => User, (user) => user.carts, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @Expose({ name: 'userId' })
  @Transform(({ value }) => value.id)
  user: User;

  @OneToMany(() => CartToProduct, (cartToProduct) => cartToProduct.cart, {
    eager: true,
    cascade: true,
  })
  @Expose({ name: 'products' })
  cartToProduct: CartToProduct[];
}
