import { Column, PrimaryGeneratedColumn } from 'typeorm';

export class ErrorCode {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  code!: string;

  @Column({ type: 'varchar', length: 150 })
  message!: string;
}
