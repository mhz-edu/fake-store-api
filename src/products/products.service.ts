import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductRepository } from './product.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsQueryDto } from './dto/query.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductRepository)
    private productRepository: ProductRepository,
  ) {}

  getAllProducts(limit?: number, sort?: string): Promise<Product[]> {
    return this.productRepository.getProducts({ limit, sort });
  }

  getAllProductsByCategory(category: string): Promise<Product[]> {
    return this.productRepository.getProducts({} as ProductsQueryDto, category);
  }

  async getProductById(id: number): Promise<Product> {
    const found = await this.productRepository.findOne({ where: { id } });

    if (!found) {
      throw new NotFoundException();
    } else {
      return found;
    }
  }

  async createProduct(createProductDto: CreateProductDto): Promise<Product> {
    return this.productRepository.createProduct(createProductDto);
  }

  async updateProduct(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const product = await this.getProductById(id);
    return this.productRepository.updateProduct(product, updateProductDto);
  }

  async deleteProduct(id: number) {
    const result = await this.productRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException();
    }
  }
}
