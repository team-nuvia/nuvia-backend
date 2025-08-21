import { EmailsService } from '@/emails/emails.service';
import { CombineResponses } from '@common/decorator/combine-responses.decorator';
import { LoginUser } from '@common/decorator/login-user.param.decorator';
import { RequiredLogin } from '@common/decorator/required-login.decorator';
import { Transactional } from '@common/decorator/transactional.decorator';
import { Body, Controller, HttpStatus, Param, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from '@users/entities/user.entity';
import { InviteSubscriptionPayloadDto } from './dto/payload/invite-subscription.payload.dto';
import { UpdateSubscriptionDto } from './dto/payload/update-subscription.dto';
import { SuccessInviteSubscriptionResponseDto } from './dto/response/success-invite-subscription.response.dto';
import { Subscription } from './entities/subscription.entity';
import { SubscriptionsInvitationConstraintValidation } from './subscriptions-invitation-constraint.guard';
import { SubscriptionsService } from './subscriptions.service';

@ApiTags('구독')
@Controller('subscriptions')
export class SubscriptionsController {
  constructor(
    private readonly subscriptionsService: SubscriptionsService,
    private readonly emailsService: EmailsService,
  ) {}

  @ApiOperation({ summary: '초대 메일 발송' })
  @CombineResponses(HttpStatus.OK, SuccessInviteSubscriptionResponseDto)
  @SubscriptionsInvitationConstraintValidation()
  @RequiredLogin
  @Transactional()
  @Post(':subscriptionId/invite')
  async inviteUsers(
    @LoginUser() user: LoginUserData,
    @Param('subscriptionId') subscriptionId: string,
    @Body() inviteSubscriptionDto: InviteSubscriptionPayloadDto,
  ) {
    const invitationEmailCallback = async (toUser: string, fromUser: User, subscription: Subscription, invitationVerificationLink: string) => {
      await this.emailsService.sendInvitationMail(toUser, {
        inviteeEmail: toUser,
        inviterName: fromUser.name,
        organizationName: subscription.name,
        invitationUrl: invitationVerificationLink,
        inviterEmail: fromUser.email,
      });
    };

    await this.subscriptionsService.inviteUsers(+subscriptionId, inviteSubscriptionDto, user.id, invitationEmailCallback);
    return new SuccessInviteSubscriptionResponseDto();
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSubscriptionDto: UpdateSubscriptionDto) {
    return this.subscriptionsService.update(+id, updateSubscriptionDto);
  }
}
