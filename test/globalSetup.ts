import { useDataSource, useSeeders } from '@jorgebodega/typeorm-seeding';
import { DataSource } from 'typeorm';
import { mongoCofig } from '../src/config/typeorm.config';
import { CartSeeder } from '../src/seeder/cart.seeder';
import { ProductSeeder } from '../src/seeder/product.seeder';
import { UserSeeder } from '../src/seeder/user.seeder';
import { Product } from '../src/products/product.entity';
import { Cart } from '../src/cart/cart.entity';
import { User } from '../src/user/user.entity';

export default async function setup() {
  const dataSource = await new DataSource(mongoCofig).initialize();
  console.log(
    await dataSource.mongoManager.deleteMany(User, {}),
    await dataSource.mongoManager.deleteMany(Product, {}),
    await dataSource.mongoManager.deleteMany(Cart, {}),
  );

  await dataSource.synchronize();
  await useDataSource(dataSource);
  await useSeeders(UserSeeder);
  await useSeeders(ProductSeeder);
  await useSeeders(CartSeeder);

  globalThis.__dataSource__ = dataSource;
}
