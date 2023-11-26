import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Cart } from './cart.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateCartDto } from './dto/create-cart.dto';
import { CartToProduct } from './cart-product.entity';
import { CartsQueryDto } from './dto/query.dto';
import { EditCartDto } from './dto/edit-cart.dto';

@Injectable()
export class CartRepository extends Repository<Cart> {
  private logger = new Logger('CartRepository');

  constructor(private dataSource: DataSource) {
    super(Cart, dataSource.createEntityManager());
  }

  async createCart(createCartDto: CreateCartDto) {
    const { userId, products } = createCartDto;

    const runner = this.dataSource.createQueryRunner();

    await runner.connect();

    await runner.startTransaction();

    const createCartQuery = async () => {
      const q = this.createQueryBuilder('cart', runner)
        .insert()
        .values({
          user: { id: userId },
        });
      return (await q.execute()).identifiers[0].id;
    };

    const addProductsToCartQuery = async (cartId: number) => {
      const q = this.dataSource
        .createQueryBuilder(runner)
        .insert()
        .into(CartToProduct)
        .values(products.map((product) => ({ cartId, ...product })));

      await q.execute();
    };

    try {
      const cartId = await createCartQuery();
      await addProductsToCartQuery(cartId);
      await runner.commitTransaction();

      return this.findOne({ where: { id: cartId } });
    } catch (err) {
      await runner.rollbackTransaction();
      this.logger.error(JSON.stringify(err));
      if (err.code === '23503') {
        throw new NotFoundException(err.detail);
      }
      throw new InternalServerErrorException();
    } finally {
      await runner.release();
    }
  }

  async editCart(cartId: number, editCartDto: EditCartDto) {
    const { userId, date, products } = editCartDto;

    const runner = this.dataSource.createQueryRunner();

    await runner.connect();

    await runner.startTransaction();

    const updateCartQuery = async () => {
      const q = this.createQueryBuilder('cart', runner)
        .update()
        .set({
          user: { id: userId },
          date: new Date(date),
        })
        .where('id = :cartId', { cartId });

      await q.execute();
    };

    const updateProductsInCartQuery = async () => {
      const q = this.dataSource
        .createQueryBuilder(runner)
        .insert()
        .into(CartToProduct)
        .values(products.map((product) => ({ cartId, ...product })))
        .orUpdate(['quantity'], ['cartId', 'productId'], {
          skipUpdateIfNoValuesChanged: true,
        });

      await q.execute();
    };

    try {
      await updateCartQuery();
      await updateProductsInCartQuery();
      await runner.commitTransaction();

      return this.findOne({ where: { id: cartId } });
    } catch (err) {
      await runner.rollbackTransaction();
      this.logger.error(JSON.stringify(err));
      if (err.code === '23503') {
        throw new NotFoundException(err.detail);
      }
      throw new InternalServerErrorException();
    } finally {
      await runner.release();
    }
  }

  async getCarts(userId?: number, queryOptions?: CartsQueryDto) {
    const { limit, sort, startdate, enddate } = queryOptions;

    const query = this.createQueryBuilder('cart')
      .select([
        'cart.id',
        'cart.date',
        'user.id',
        'cartToProduct.productId',
        'cartToProduct.quantity',
      ])
      .leftJoin('cart.user', 'user')
      .leftJoin('cart.cartToProduct', 'cartToProduct')
      .where((qb) => {
        const subQuery = qb.subQuery().select('cart.id').from(Cart, 'cart');

        if (userId) {
          subQuery.andWhere('cart.userId = :userId');
        }

        if (limit) {
          subQuery.limit(limit);
        }

        if (sort) {
          subQuery.orderBy('cart.id', sort.toUpperCase() as 'ASC' | 'DESC');
        }

        if (startdate) {
          subQuery.andWhere('cart.date >= :startdate');
        }

        if (enddate) {
          subQuery.andWhere('cart.date <= :enddate');
        }

        return 'cart.id IN ' + subQuery.getQuery();
      })
      .setParameters({ userId, startdate, enddate });

    try {
      this.logger.verbose(query.getQuery());
      return query.getMany();
    } catch (error) {
      this.logger.error('Error getting products from DB', error.stack);
      throw new InternalServerErrorException();
    }
  }

  async deleteCart(cartId: number) {
    const query = this.createQueryBuilder('cart');
    query.delete().from(Cart).where('id = :id', { id: cartId });

    try {
      return query.execute();
    } catch (error) {
      this.logger.error(
        `Error getting users from DB query ${query}`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }
  }
}
