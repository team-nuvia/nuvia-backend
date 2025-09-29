import { DefaultDateInterface } from '@common/interface/default-date.interface';
import { BoolTinyIntTransformer } from '@common/transformer/bool.transformer';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, Relation } from 'typeorm';
import { Permission } from '../../entities/permission.entity';
import { PermissionGrantType } from '../../enums/permission-grant-type.enum';

@Entity()
export class PermissionGrant extends DefaultDateInterface {
  @PrimaryGeneratedColumn({ comment: '권한 관리 아이디' })
  id!: number;

  @Column('int', { comment: '권한 아이디' })
  permissionId!: number;

  @Column('varchar', { length: 45, comment: '권한 타입' })
  type!: PermissionGrantType;

  @Column('varchar', { default: null, length: 200, nullable: true, comment: '권한 설명' })
  description!: string | null;

  @Column('tinyint', { default: true, transformer: BoolTinyIntTransformer, comment: '권한 허용 여부' })
  isAllowed!: boolean;

  @ManyToOne(() => Permission, (permission) => permission.permissionGrants, {
    onDelete: 'NO ACTION',
  })
  permission!: Relation<Permission>;
}
