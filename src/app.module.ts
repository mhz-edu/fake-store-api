import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { mongoCofig } from './config/typeorm.config';
import { AuthModule } from './auth/auth.module';
import { CartModule } from './cart/carts.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(mongoCofig),
    ProductsModule,
    AuthModule,
    CartModule,
    UserModule,
  ],
})
export class AppModule {}
