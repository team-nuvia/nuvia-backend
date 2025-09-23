import { Injectable } from '@nestjs/common';
import { NotificationType } from '@share/enums/notification-type';
import { User } from '@users/entities/user.entity';
import { InviteSubscriptionPayloadDto } from './dto/payload/invite-subscription.payload.dto';
import { UpdateInvitationWithNotificationPayloadDto } from './dto/payload/update-invitation-with-notification.payload.dto';
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

  // addNotifications({
  //   subscriptionId,
  //   type,
  //   userId,
  //   emails,
  //   title,
  //   content,
  // }: {
  //   subscriptionId: number;
  //   type: NotificationType;
  //   userId: number;
  //   emails: string[];
  //   title: string;
  //   content: string;
  // }) {
  //   return this.subscriptionsRepository.addNotifications({ subscriptionId, type, userId, emails, title, content });
  // }

  addInviteNotifications({
    subscriptionId,
    type,
    userId,
    emails,
  }: {
    subscriptionId: number;
    type: NotificationType;
    userId: number;
    emails: string[];
  }) {
    return this.subscriptionsRepository.addInviteNotifications({ subscriptionId, type, userId, emails });
  }

  update(id: number, updateSubscriptionDto: UpdateSubscriptionDto) {
    return this.subscriptionsRepository.orm.getManager().update(Subscription, id, updateSubscriptionDto);
  }

  async updateInvitationWithNotification(
    subscriptionId: number,
    userId: number,
    updateInvitationWithNotificationDto: UpdateInvitationWithNotificationPayloadDto,
  ) {
    await this.subscriptionsRepository.updateInvitationWithNotification(subscriptionId, userId, updateInvitationWithNotificationDto);
  }
}
