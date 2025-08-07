import { CreateDateColumn, DeleteDateColumn, UpdateDateColumn } from 'typeorm';

export abstract class DefaultDateInterface {
  @CreateDateColumn({ comment: '생성 일시' })
  createdAt!: Date;

  @UpdateDateColumn({ comment: '수정 일시' })
  updatedAt!: Date;

  @DeleteDateColumn({ select: false, default: null, comment: '삭제 일시' })
  deletedAt!: Date | null;
}
