import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { username, email, password, confirmPassword } = createUserDto;

    const existingUser = await this.usersRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new HttpException('Email already in use', HttpStatus.BAD_REQUEST);
    }

    if (password !== confirmPassword) {
      throw new HttpException('Passwords do not match', HttpStatus.BAD_REQUEST);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User();
    newUser.username = username;
    newUser.password = hashedPassword;
    newUser.email = email;

    this.usersRepository.save(newUser);

    return 'user Successfully Registered';
  }

  async findOneByEmail(email: string) {
    return this.usersRepository
      .createQueryBuilder('user')
      .where('user.email = :email', { email })
      .addSelect('user.password')
      .getOne();
  }

  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async update(id: number, updateUserDto: Partial<User>) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    await this.usersRepository.update(id, updateUserDto);
    return this.findOne(id);
  }

  async delete(id: number) {
    const result = await this.usersRepository.delete(id);
    if (!result.affected) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return { message: `User with ID ${id} successfully deleted` };
  }
}
