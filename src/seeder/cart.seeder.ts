import { Seeder } from '@jorgebodega/typeorm-seeding';
import { DataSource } from 'typeorm';
import { cartData } from './carts';
import { Cart } from '../cart/cart.entity';
import { User } from '../user/user.entity';

export class CartSeeder implements Seeder {
  public async run(dataSource: DataSource) {
    console.log('Running cart seeder');

    // const carts = await Promise.all(
    //   cartData.map(async (cart, index) => {
    //     const user = await dataSource.mongoManager.findOne(User, {
    //       where: { id: cart.userId },
    //     });
    //     return { id: index, user: user._id, date: cart.date };
    //   }),
    // );
    await dataSource.mongoManager.insert(
      Cart,
      cartData.map((cart, index) => ({ id: index, ...cart })),
    );
    // await Promise.all(
    //   cartData.map(async (cart) => {
    //     const cartQuery = `INSERT INTO "cart" ("userId", "date") VALUES (
    //         ${cart.userId},
    //         '${cart.date.toISOString()}'
    //     ) RETURNING *`;

    //     const createdCart = await dataSource
    //       .createEntityManager()
    //       .query(cartQuery);

    //     const cartProductSubQuery = cart.products
    //       .map(
    //         (product) =>
    //           `(${createdCart[0].id}, ${product.productId}, ${product.quantity})`,
    //       )
    //       .join(',');
    //     const cartProductQuery = `INSERT INTO "cart_to_product" ("cartId", "productId", "quantity") VALUES ${cartProductSubQuery};`;
    //     await dataSource.createEntityManager().query(cartProductQuery);
    //   }),
    // );
  }
}
