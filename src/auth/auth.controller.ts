import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { loginUserDto } from './dto/login-user.dto';
import { Public } from './guard/jwt-strategy';
import { Roles } from './guard/jwt-roles.guard';
import { Role } from './guard/enum/role.enum';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { validate } from 'class-validator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    const errors = await validate(createUserDto);
    if (errors.length > 0) {
      throw new HttpException(
        { message: 'Validation failed', errors },
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.authService.register(createUserDto);
  }

  @Roles(Role.USER, Role.ADMIN)
  @Public()
  @Post('login')
  loginUser(@Body() body: loginUserDto) {
    return this.authService.login(body);
  }

  @Roles(Role.ADMIN)
  @Public()
  @Post('login/admin')
  async loginAdmin(@Body() createUserDto: CreateUserDto) {
    return this.authService.loginAdmin(createUserDto);
  }
}
