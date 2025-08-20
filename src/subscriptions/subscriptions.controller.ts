import { Body, Controller, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { InviteSubscriptionPayloadDto } from './dto/payload/invite-subscription.payload.dto';
import { UpdateSubscriptionDto } from './dto/payload/update-subscription.dto';
import { SubscriptionsService } from './subscriptions.service';

@ApiTags('구독')
@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Post(':subscriptionId/invite')
  inviteUsers(@Param('subscriptionId') subscriptionId: string, @Body() inviteSubscriptionDto: InviteSubscriptionPayloadDto) {
    return this.subscriptionsService.inviteUsers(+subscriptionId, inviteSubscriptionDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSubscriptionDto: UpdateSubscriptionDto) {
    return this.subscriptionsService.update(+id, updateSubscriptionDto);
  }
}
