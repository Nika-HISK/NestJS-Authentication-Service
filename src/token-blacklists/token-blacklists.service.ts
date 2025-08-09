import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { TokenBlacklist } from './entities/token-blacklist.entity';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class TokenBlacklistService {
  constructor(
    @InjectRepository(TokenBlacklist)
    private readonly tokenBlacklistRepository: Repository<TokenBlacklist>,
  ) {}

  async addToBlacklist(
    token: string,
    userId: number,
    expiresAt: Date,
  ): Promise<void> {
    const blacklistedToken = new TokenBlacklist();
    blacklistedToken.token = token;
    blacklistedToken.userId = userId;
    blacklistedToken.expiresAt = expiresAt;

    await this.tokenBlacklistRepository.save(blacklistedToken);
  }

  async isTokenBlacklisted(token: string): Promise<boolean> {
    const blacklistedToken = await this.tokenBlacklistRepository.findOne({
      where: { token },
    });

    return !!blacklistedToken;
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async cleanupExpiredTokens(): Promise<void> {
    const now = new Date();
    await this.tokenBlacklistRepository.delete({
      expiresAt: LessThan(now),
    });
  }
}
