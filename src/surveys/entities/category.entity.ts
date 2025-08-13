import { DefaultDateInterface } from '@common/interface/default-date.interface';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn, Relation } from 'typeorm';
import { Survey } from './survey.entity';

@Entity()
export class Category extends DefaultDateInterface {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('varchar', { length: 50, comment: '카테고리 이름' })
  name!: string;

  @OneToMany(() => Survey, (survey) => survey.category, { cascade: true })
  surveys!: Relation<Survey>[];
}
