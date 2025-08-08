import { Injectable } from '@nestjs/common';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { Subscription } from './entities/subscription.entity';
import { SubscriptionsRepository } from './subscriptions.repository';

@Injectable()
export class SubscriptionsService {
  constructor(private readonly subscriptionsRepository: SubscriptionsRepository) {}

  update(id: number, updateSubscriptionDto: UpdateSubscriptionDto) {
    return this.subscriptionsRepository.orm.getManager().update(Subscription, id, updateSubscriptionDto);
  }
}
