import { Seeder } from '@jorgebodega/typeorm-seeding';
import { DataSource } from 'typeorm';
import { userData } from './users';
import { User } from '../user/user.entity';

export class UserSeeder implements Seeder {
  public async run(dataSource: DataSource) {
    console.log('Running user seeder');
    await dataSource.createEntityManager().insert(
      User,
      userData.map((user) => ({
        ...user,
        password: 'test',
        salt: 'test',
      })),
    );
  }
}
