import { PartialType } from '@nestjs/mapped-types';
import { CreateTokenBlacklistDto } from './create-token-blacklist.dto';

export class UpdateTokenBlacklistDto extends PartialType(CreateTokenBlacklistDto) {}
