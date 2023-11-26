import { Seeder } from '@jorgebodega/typeorm-seeding';
import { DataSource } from 'typeorm';
import { cartData } from './carts';

export class CartSeeder implements Seeder {
  public async run(dataSource: DataSource) {
    console.log('Running cart seeder');

    await Promise.all(
      cartData.map(async (cart) => {
        const cartQuery = `INSERT INTO "cart" ("userId", "date") VALUES (
            ${cart.userId},
            '${cart.date.toISOString()}'
        ) RETURNING *`;

        const createdCart = await dataSource
          .createEntityManager()
          .query(cartQuery);

        const cartProductSubQuery = cart.products
          .map(
            (product) =>
              `(${createdCart[0].id}, ${product.productId}, ${product.quantity})`,
          )
          .join(',');
        const cartProductQuery = `INSERT INTO "cart_to_product" ("cartId", "productId", "quantity") VALUES ${cartProductSubQuery};`;
        await dataSource.createEntityManager().query(cartProductQuery);
      }),
    );
  }
}
