import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from '../user/user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredsDto } from './dto/auth-creds.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
  private logger = new Logger('AuthService');

  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async signUp(authCreds: AuthCredsDto) {
    return this.userRepository.signUp(authCreds);
  }

  async singIn(authCreds: AuthCredsDto) {
    const username = await this.userRepository.validatePassword(authCreds);

    if (!username) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: JwtPayload = { username };
    const accessToken = await this.jwtService.signAsync(payload);
    this.logger.debug(
      `Generated JWT token for payload ${JSON.stringify(payload)}`,
    );

    return { accessToken };
  }
}
