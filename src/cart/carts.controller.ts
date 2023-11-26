import {
  Body,
  Controller,
  Logger,
  Get,
  Query,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
  ParseIntPipe,
  UseInterceptors,
  ClassSerializerInterceptor,
  Patch,
  Delete,
} from '@nestjs/common';
import { CartService } from './carts.service';
import { Cart } from './cart.entity';
import { CreateCartDto } from './dto/create-cart.dto';
import { EditCartDto } from './dto/edit-cart.dto';

@Controller('carts')
@UseInterceptors(ClassSerializerInterceptor)
export class CartController {
  private logger = new Logger('CartsController');

  constructor(private cartService: CartService) {}

  @Post()
  @UsePipes(ValidationPipe)
  createCart(@Body() createCartDto: CreateCartDto): Promise<Cart> {
    this.logger.verbose(
      `User creating cart. Data ${JSON.stringify(createCartDto)}`,
    );
    return this.cartService.createCart(createCartDto);
  }

  @Get()
  getCarts(
    @Query('limit') limit?: number,
    @Query('sort') sort?: string,
    @Query('startdate') startdate?: string,
    @Query('enddate') enddate?: string,
  ): Promise<Cart[]> {
    this.logger.verbose(
      `User retrieving all carts. Params limit=${limit}, sort=${sort}, start=${startdate}, end=${enddate}`,
    );
    return this.cartService.getCarts({ limit, sort, startdate, enddate });
  }

  @Get('/user/:id')
  getUserCarts(
    @Param('id', ParseIntPipe) userId: number,
    @Query('limit') limit?: number,
    @Query('sort') sort?: string,
    @Query('startdate') startdate?: string,
    @Query('enddate') enddate?: string,
  ): Promise<Cart[]> {
    this.logger.verbose(
      `User retrieving all carts for user ${userId}. Params limit=${limit}, sort=${sort}, start=${startdate}, end=${enddate}`,
    );
    return this.cartService.getCarts(
      { limit, sort, startdate, enddate },
      userId,
    );
  }

  @Get('/:id')
  getCart(@Param('id', ParseIntPipe) id: number): Promise<Cart> {
    return this.cartService.getCart(id);
  }

  @Patch('/:id')
  editCart(
    @Param('id', ParseIntPipe) id: number,
    @Body() editCartDto: EditCartDto,
  ): Promise<Cart> {
    this.logger.verbose(
      `User editing cart ${id}. Data ${JSON.stringify(editCartDto)}`,
    );
    return this.cartService.editCart(id, editCartDto);
  }

  @Delete('/:id')
  deleteCart(@Param('id', ParseIntPipe) id: number) {
    this.logger.verbose(`User deleting cart ${id}`);
    return this.cartService.deleteCart(id);
  }
}
