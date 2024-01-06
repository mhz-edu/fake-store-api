import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ObjectId,
  ObjectIdColumn,
} from 'typeorm';

@Entity()
export class Cart extends BaseEntity {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  id: number;

  @CreateDateColumn()
  date: Date;

  @Column()
  userId: number;

  @Column()
  products: {
    productId: number;
    quantity: number;
  }[];

  constructor(props?) {
    super();
    if (props) {
      const { id, date, userId, products } = props;
      this.id = id;
      this.date = date;
      this.userId = userId;
      this.products = products;
    }
  }
}
