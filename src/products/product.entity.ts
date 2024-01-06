import { BaseEntity, Column, Entity, ObjectId, ObjectIdColumn } from 'typeorm';

@Entity()
export class Product extends BaseEntity {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'decimal' })
  price: number;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  image: string;

  @Column({ nullable: true })
  category: string;

  constructor(props?) {
    super();
    if (props) {
      const { id, title, price, description, image, category } = props;
      this.id = id;
      this.title = title;
      this.price = price;
      this.description = description;
      this.image = image;
      this.category = category;
    }
  }
}
