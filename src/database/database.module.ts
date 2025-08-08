import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrmHelper } from '@util/orm.helper';
import { DatabaseService } from './database.service';
import { TxContext } from './tx.context';
import { TxRunner } from './tx.runner';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useClass: DatabaseService,
    }),
  ],
  providers: [TxContext, TxRunner, OrmHelper],
  exports: [TypeOrmModule, TxContext, TxRunner, OrmHelper],
})
export class DatabaseModule {}
