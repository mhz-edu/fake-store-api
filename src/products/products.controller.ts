import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
  ParseIntPipe,
  Delete,
  Put,
  Query,
  Logger,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from './product.entity';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
  private logger = new Logger('ProductsController');

  constructor(private productsService: ProductsService) {}

  @Get()
  getAllProducts(
    @Query('limit') limit?: number,
    @Query('sort') sort?: string,
  ): Promise<Product[]> {
    this.logger.verbose(
      `User retrieving all products. Params limit=${limit}, sort=${sort}`,
    );
    return this.productsService.getAllProducts(limit, sort);
  }

  @Get('/category/:categoryName')
  getProductsByCategory(
    @Param('categoryName') categoryName: string,
  ): Promise<Product[]> {
    return this.productsService.getAllProductsByCategory(categoryName);
  }

  @Get('/:id')
  getProductById(@Param('id', ParseIntPipe) id: number): Promise<Product> {
    return this.productsService.getProductById(id);
  }

  @Post()
  @UsePipes(ValidationPipe)
  createProduct(@Body() createProductDto: CreateProductDto): Promise<Product> {
    this.logger.verbose(
      `User creating product. Data ${JSON.stringify(createProductDto)}`,
    );
    return this.productsService.createProduct(createProductDto);
  }

  @Delete('/:id')
  deleteProduct(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.deleteProduct(id);
  }

  @Put('/:id')
  @UsePipes(ValidationPipe)
  updateProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    return this.productsService.updateProduct(id, updateProductDto);
  }
}
