import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './guard/jwt-auth.guard';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { TokenBlacklist } from 'src/token-blacklists/entities/token-blacklist.entity';
import { TokenBlacklistService } from 'src/token-blacklists/token-blacklists.service';

@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forFeature([TokenBlacklist]),
    ScheduleModule.forRoot(),
  ],
  providers: [
    AuthService,
    TokenBlacklistService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
  controllers: [AuthController],
})
export class AuthModule {}
