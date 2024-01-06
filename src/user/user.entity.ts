import {
  BaseEntity,
  Column,
  Entity,
  ObjectId,
  ObjectIdColumn,
  Unique,
} from 'typeorm';
import * as bcrypt from 'bcrypt';

@Entity()
@Unique(['username'])
export class User extends BaseEntity {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  id: number;

  @Column()
  username: string;

  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true })
  salt: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ type: 'json', nullable: true })
  name: object;

  @Column({ type: 'json', nullable: true })
  address: object;

  @Column()
  carts: number[];

  async validatePassword(password: string): Promise<boolean> {
    const hash = await bcrypt.hash(password, this.salt);
    return hash === this.password;
  }

  constructor(props?) {
    super();
    if (props) {
      const {
        username,
        avatar,
        phone,
        name,
        address,
        password,
        salt,
        id,
        carts,
      } = props;
      this.username = username;
      this.avatar = avatar;
      this.phone = phone;
      this.name = name;
      this.address = address;
      this.id = id;
      this.password = password;
      this.salt = salt;
      this.carts = carts;
    }
  }
}
