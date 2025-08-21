import { Injectable } from '@nestjs/common';
import { User } from '@users/entities/user.entity';
import { InviteSubscriptionPayloadDto } from './dto/payload/invite-subscription.payload.dto';
import { UpdateSubscriptionDto } from './dto/payload/update-subscription.dto';
import { Subscription } from './entities/subscription.entity';
import { SubscriptionsRepository } from './subscriptions.repository';

@Injectable()
export class SubscriptionsService {
  constructor(private readonly subscriptionsRepository: SubscriptionsRepository) {}

  async inviteUsers(
    subscriptionId: number,
    inviteSubscriptionDto: InviteSubscriptionPayloadDto,
    userId: number,
    invitationEmailCallback: (toUser: string, fromUser: User, subscription: Subscription, invitationVerificationLink: string) => Promise<void>,
  ): Promise<void> {
    await this.subscriptionsRepository.inviteUsers(subscriptionId, inviteSubscriptionDto, userId, invitationEmailCallback);
  }

  update(id: number, updateSubscriptionDto: UpdateSubscriptionDto) {
    return this.subscriptionsRepository.orm.getManager().update(Subscription, id, updateSubscriptionDto);
  }
}
