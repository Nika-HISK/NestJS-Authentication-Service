import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersRepository } from './repositories/users.repository';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersService, UsersRepository],
  controllers: [UsersController],
  exports: [UsersRepository, UsersService],
})
export class UsersModule {}
