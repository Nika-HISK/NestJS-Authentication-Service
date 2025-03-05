import { Role } from 'src/auth/guard/enum/role.enum';
import { BaseEntity } from 'src/Common/base.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class User extends BaseEntity {
  @Column()
  username: string;

  @Column({ select: false })
  password: string;

  @Column({ unique: true })
  email: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.USER,
  })
  role: string;

  @Column({ default: false })
  banned: boolean;
}
