import { Injectable } from '@nestjs/common';
import { InviteSubscriptionPayloadDto } from './dto/payload/invite-subscription.payload.dto';
import { UpdateSubscriptionDto } from './dto/payload/update-subscription.dto';
import { Subscription } from './entities/subscription.entity';
import { SubscriptionsRepository } from './subscriptions.repository';

@Injectable()
export class SubscriptionsService {
  constructor(private readonly subscriptionsRepository: SubscriptionsRepository) {}

  inviteUsers(subscriptionId: number, inviteSubscriptionDto: InviteSubscriptionPayloadDto) {
    return this.subscriptionsRepository.inviteUsers(subscriptionId, inviteSubscriptionDto);
  }

  update(id: number, updateSubscriptionDto: UpdateSubscriptionDto) {
    return this.subscriptionsRepository.orm.getManager().update(Subscription, id, updateSubscriptionDto);
  }
}
