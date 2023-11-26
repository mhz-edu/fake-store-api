import { DataSource, Repository } from 'typeorm';
import { User } from './user.entity';
import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { AuthCredsDto } from '../auth/dto/auth-creds.dto';
import * as bcrypt from 'bcrypt';
import { UsersQueryDto } from './dto/query.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserRepository extends Repository<User> {
  private logger = new Logger('UserRepository');

  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async signUp(authCreds: AuthCredsDto): Promise<void> {
    const { username, password } = authCreds;

    const exist = await this.exist({ where: { username } });

    if (exist) {
      throw new ConflictException('Username already exists');
    }

    const user = new User();
    user.username = username;
    user.salt = await bcrypt.genSalt();
    user.password = await this.hashPassword(password, user.salt);

    await user.save();
  }

  async validatePassword(authCreds: AuthCredsDto): Promise<string> {
    const { username, password } = authCreds;

    const user = await this.findOne({ where: { username } });
    if (user && (await user.validatePassword(password))) {
      return user.username;
    } else {
      return null;
    }
  }

  private hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }

  async getUsers(queryOptions?: UsersQueryDto): Promise<User[]> {
    const { limit, sort } = queryOptions;
    const query = this.createQueryBuilder('user');

    if (limit) {
      query.limit(limit);
    }

    if (sort) {
      query.orderBy('user.username', sort.toUpperCase() as 'ASC' | 'DESC');
    }

    try {
      return query.getMany();
    } catch (error) {
      this.logger.error(
        `Error getting users from DB query ${query}`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { username, name, avatar, phone, address } = createUserDto;

    const user = new User();
    user.username = username;
    user.name = name;
    user.avatar = avatar;
    user.phone = phone;
    user.address = address;

    await user.save();
    return user;
  }

  async updateUser(user: User, updateUserDto: UpdateUserDto): Promise<User> {
    const { name, avatar, phone, address } = updateUserDto;
    user.name = name;
    user.avatar = avatar;
    user.phone = phone;
    user.address = address;

    await user.save();
    return user;
  }

  async deleteUser(user: User) {
    const query = this.createQueryBuilder('user');
    query.delete().from(User).where('id = :id', { id: user.id });

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
