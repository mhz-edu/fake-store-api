import { Seeder } from '@jorgebodega/typeorm-seeding';
import { Product } from '../products/product.entity';
import { DataSource } from 'typeorm';
import { productData } from './products';

export class ProductSeeder implements Seeder {
  public async run(dataSource: DataSource) {
    console.log('Running product seeder');
    await dataSource.createEntityManager().insert(Product, productData);
  }
}
