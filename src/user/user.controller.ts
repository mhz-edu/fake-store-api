import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UserController {
  private logger = new Logger('UserController');

  constructor(private userService: UserService) {}

  @Get()
  @UsePipes(
    new ValidationPipe({
      skipMissingProperties: true,
      transform: true,
    }),
  )
  getAllUsers(
    @Query('limit') limit?: number,
    @Query('sort') sort?: string,
  ): Promise<User[]> {
    this.logger.verbose(
      `User retrieving all Users. Params limit=${limit}, sort=${sort}`,
    );
    return this.userService.getAllUsers(limit, sort);
  }

  @Get('/:id')
  getUserById(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.userService.getUserById(id);
  }

  @Post()
  @UsePipes(ValidationPipe)
  createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    this.logger.verbose(
      `User creating User. Data ${JSON.stringify(createUserDto)}`,
    );
    return this.userService.createUser(createUserDto);
  }

  @Delete('/:id')
  deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.userService.deleteUser(id);
  }

  @Put('/:id')
  @UsePipes(ValidationPipe)
  updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.userService.updateUser(id, updateUserDto);
  }
}
