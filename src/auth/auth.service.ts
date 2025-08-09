import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { loginUserDto } from './dto/login-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { Role } from './guard/enum/role.enum';
import { TokenBlacklistService } from 'src/token-blacklists/token-blacklists.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly tokenBlacklistService: TokenBlacklistService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    const { email } = createUserDto;

    const existingUser = await this.usersService.findOneByEmail(email);
    if (existingUser) {
      throw new HttpException('Email already in use', HttpStatus.BAD_REQUEST);
    }

    return this.usersService.create(createUserDto);
  }

  async login(body: loginUserDto) {
    const { email, password } = body;
    const user = await this.usersService.findOneByEmail(email);
    const isPasswordCorrect =
      user && (await bcrypt.compare(password, user.password));

    if (!isPasswordCorrect) {
      throw new UnauthorizedException();
    }

    if (user.banned) {
      throw new UnauthorizedException('Access denied. You are banned.');
    }

    const payload = { sub: user.id, email: user.email, role: user.role };
    return this.generateToken(payload);
  }

  async logout(token: string, userId: number): Promise<{ message: string }> {
    try {
      const decodedToken = this.jwtService.decode(token) as any;

      if (!decodedToken || !decodedToken.exp) {
        throw new HttpException('Invalid token', HttpStatus.BAD_REQUEST);
      }

      const expiresAt = new Date(decodedToken.exp * 1000);

      await this.tokenBlacklistService.addToBlacklist(token, userId, expiresAt);

      return { message: 'Successfully logged out' };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Logout failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private async generateToken(payload: any) {
    return {
      accessToken: await this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_ACCESS_EXP,
      }),
    };
  }

  async loginAdmin(createUserDto: CreateUserDto) {
    const { email, password } = createUserDto;
    const user = await this.usersService.findOneByEmail(email);
    const isPasswordCorrect =
      user && (await bcrypt.compare(password, user.password));

    if (!isPasswordCorrect) {
      throw new HttpException(
        'The email or password you entered is incorrect',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (user.banned) {
      throw new UnauthorizedException('Access denied. You are banned.');
    }

    if (user.role !== Role.ADMIN) {
      throw new UnauthorizedException('Access denied. Admins only.');
    }

    const payload = { sub: user.id, email: user.email, role: user.role };
    return this.generateToken(payload);
  }
}
