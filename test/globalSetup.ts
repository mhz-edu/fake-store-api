import { useDataSource, useSeeders } from '@jorgebodega/typeorm-seeding';
import { DataSource } from 'typeorm';
import { typeOrmCofig } from '../src/config/typeorm.config';
import { CartSeeder } from '../src/seeder/cart.seeder';
import { ProductSeeder } from '../src/seeder/product.seeder';
import { UserSeeder } from '../src/seeder/user.seeder';

export default async function setup() {
  const dataSource = await new DataSource(typeOrmCofig).initialize();

  await dataSource.synchronize(true);
  await useDataSource(dataSource);
  await useSeeders(UserSeeder);
  await useSeeders(ProductSeeder);
  await useSeeders(CartSeeder);

  globalThis.__dataSource__ = dataSource;
}
