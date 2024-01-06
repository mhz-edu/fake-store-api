import {
  DataSource,
  Repository,
  MongoRepository,
  FindManyOptions,
} from 'typeorm';
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
export class UserRepository extends MongoRepository<User> {
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
    const query = `get users ${JSON.stringify(queryOptions)}`;
    const options: FindManyOptions = {};
    if (limit) {
      options.take = limit;
    }

    if (sort) {
      options.order = { usename: sort };
    }

    try {
      return await this.find(options);
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

    const maxId = await this.count();

    const user = new User();
    user.id = maxId + 1;
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
    console.log(user);
    user.name = name;
    user.avatar = avatar;
    user.phone = phone;
    user.address = address;

    await user.save();
    return user;
  }

  async deleteUser(id: number) {
    const query = 'delete user';
    try {
      return await this.findOneAndDelete({ where: { id } });
    } catch (error) {
      this.logger.error(
        `Error getting users from DB query ${query}`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }
  }
}
