import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Cart } from './cart.entity';
import {
  DataSource,
  FindManyOptions,
  MongoRepository,
  Repository,
} from 'typeorm';
import { CreateCartDto } from './dto/create-cart.dto';
// import { CartToProduct } from './cart-product.entity';
import { CartsQueryDto } from './dto/query.dto';
import { EditCartDto } from './dto/edit-cart.dto';
import { Product } from '../products/product.entity';
import { User } from '../user/user.entity';

@Injectable()
export class CartRepository extends MongoRepository<Cart> {
  private logger = new Logger('CartRepository');

  constructor(private dataSource: DataSource) {
    super(Cart, dataSource.createEntityManager());
  }

  async createCart(createCartDto: CreateCartDto) {
    const { userId, products } = createCartDto;

    let user: User;

    try {
      user = await this.dataSource.mongoManager.findOne(User, {
        where: { id: userId },
      });

      await this.dataSource.mongoManager.find(Product, {
        where: { id: { $in: products.map((prod) => prod.productId) } },
      });
    } catch (error) {
      throw new NotFoundException();
    }

    try {
      const maxId = await this.count();

      const cart = new Cart({
        id: maxId + 1,
        userId: user.id,
        products,
      });
      await cart.save();

      user.carts.push(cart.id);
      await user.save();
      return cart;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async editCart(cartId: number, editCartDto: EditCartDto) {
    const { userId, date, products } = editCartDto;

    try {
      const cart = await this.findOne({ where: { id: cartId } });

      const user = await this.dataSource.mongoManager.findOne(User, {
        where: { id: userId },
      });

      const prods = await this.dataSource.mongoManager.find(Product, {
        where: { id: { $in: products.map((prod) => prod.productId) } },
      });

      cart.userId = user.id;
      cart.products = products;

      return await cart.save();
    } catch (error) {
      throw new NotFoundException();
    }
  }

  async getCarts(userId?: number, queryOptions?: CartsQueryDto) {
    const { limit, sort, startdate, enddate } = queryOptions;

    const options: FindManyOptions = {};

    if (userId) {
      options.where = { userId, ...options.where };
    }

    if (limit) {
      options.take = limit;
    }

    if (sort) {
      options.order = { id: sort };
    }

    if (startdate) {
      options.where = { date: { $gte: new Date(startdate) }, ...options.where };
    }

    if (enddate) {
      options.where = { date: { $lte: new Date(enddate) }, ...options.where };
    }

    try {
      console.log(`get options ${JSON.stringify(options)}`);

      return await this.find(options);
    } catch (error) {
      this.logger.error('Error getting products from DB', error.stack);
      throw new InternalServerErrorException();
    }
  }

  async deleteCart(cartId: number) {
    const query = 'delete entity';
    try {
      return this.deleteOne({ where: { id: cartId } });
    } catch (error) {
      this.logger.error(
        `Error getting users from DB query ${query}`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }
  }
}
