import { Module } from '@nestjs/common';
import { TokenBlacklistService } from './token-blacklists.service';

@Module({
  providers: [TokenBlacklistService],
})
export class TokenBlacklistsModule {}
