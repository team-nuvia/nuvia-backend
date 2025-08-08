import { Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { Payment } from './entities/payment.entity';
import { PaymentsRepository } from './payments.repository';

@Injectable()
export class PaymentsService {
  constructor(private readonly paymentsRepository: PaymentsRepository) {}

  create(createPaymentDto: CreatePaymentDto) {
    return this.paymentsRepository.orm.getManager().createQueryBuilder(Payment, 'p').insert().values(createPaymentDto).execute();
  }

  findAll() {
    return this.paymentsRepository.orm.getManager().createQueryBuilder(Payment, 'p').getMany();
  }

  findOne(id: number) {
    return this.paymentsRepository.orm.getManager().createQueryBuilder(Payment, 'p').where('p.id = :id', { id }).getOne();
  }

  update(id: number, updatePaymentDto: UpdatePaymentDto) {
    return this.paymentsRepository.orm
      .getManager()
      .createQueryBuilder(Payment, 'p')
      .update()
      .set(updatePaymentDto)
      .where('p.id = :id', { id })
      .execute();
  }

  remove(id: number) {
    return this.paymentsRepository.orm.getManager().createQueryBuilder(Payment, 'p').softDelete().where('p.id = :id', { id }).execute();
  }
}
