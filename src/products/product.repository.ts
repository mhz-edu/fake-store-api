import { DataSource, Repository } from 'typeorm';
import { Product } from './product.entity';
import {
  Injectable,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsQueryDto } from './dto/query.dto';

@Injectable()
export class ProductRepository extends Repository<Product> {
  private logger = new Logger('ProductRepository');

  constructor(private dataSource: DataSource) {
    super(Product, dataSource.createEntityManager());
  }

  async getProducts(
    queryOptions?: ProductsQueryDto,
    category?: string,
  ): Promise<Product[]> {
    const { limit, sort } = queryOptions;
    const query = this.createQueryBuilder('product');

    if (category) {
      query.andWhere('product.category = :category', { category });
    }

    if (limit) {
      query.limit(limit);
    }

    if (sort) {
      query.orderBy('product.title', sort.toUpperCase() as 'ASC' | 'DESC');
    }

    try {
      return query.getMany();
    } catch (error) {
      this.logger.error(
        `Error getting products from DB query ${query}, category ${category}`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }
  }

  async createProduct(createProductDto: CreateProductDto): Promise<Product> {
    const { title, price, description, category, image } = createProductDto;

    const product = new Product();
    product.title = title;
    product.price = price;
    product.description = description;
    product.category = category;
    product.image = image;

    await product.save();
    return product;
  }

  async updateProduct(
    product: Product,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const { title, price, description, category, image } = updateProductDto;

    product.title = title;
    product.price = price;
    product.description = description;
    product.category = category;
    product.image = image;
    await product.save();

    return product;
  }
}
