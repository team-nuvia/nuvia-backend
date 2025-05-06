import { User } from '@users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';

@Entity()
export class UserSecret {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'int' })
  userId!: number;

  @Column({ type: 'varchar', length: 200, select: false })
  password!: string;

  @Column({ type: 'varchar', length: 200, select: false })
  salt!: string;

  @Column({ type: 'int', unsigned: true, select: false })
  iteration!: number;

  @OneToOne(() => User, (user) => user.userSecret)
  @JoinColumn()
  user!: Relation<User>;
}
