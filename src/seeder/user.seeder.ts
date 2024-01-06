import { Seeder } from '@jorgebodega/typeorm-seeding';
import { DataSource } from 'typeorm';
import { userData } from './users';
import { User } from '../user/user.entity';

export class UserSeeder implements Seeder {
  public async run(dataSource: DataSource) {
    console.log('Running user seeder');
    await dataSource.mongoManager.save(
      User,
      userData.map(
        (user, index) =>
          new User({
            ...user,
            id: index,
            password: 'test',
            salt: 'test',
            carts: [],
          }),
      ),
    );
    console.log('Completed user seeder');
  }
}
