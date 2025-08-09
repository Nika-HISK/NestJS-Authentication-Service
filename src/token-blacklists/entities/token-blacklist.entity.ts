import { BaseEntity } from 'src/Common/base.entity';
import { Column, Entity, Index } from 'typeorm';

@Entity()
@Index(['token'], { unique: true })
export class TokenBlacklist extends BaseEntity {
  @Column({ type: 'varchar', length: 500 })
  token: string;

  @Column()
  userId: number;

  @Column()
  expiresAt: Date;
}
