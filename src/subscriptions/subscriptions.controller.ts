import { EmailsService } from '@/emails/emails.service';
import { CombineResponses } from '@common/decorator/combine-responses.decorator';
import { LoginUser } from '@common/decorator/login-user.param.decorator';
import { RequiredLogin } from '@common/decorator/required-login.decorator';
import { Transactional } from '@common/decorator/transactional.decorator';
import { Body, Controller, HttpStatus, Param, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { NotificationType } from '@share/enums/notification-type';
import { User } from '@users/entities/user.entity';
import { InviteSubscriptionPayloadDto } from './dto/payload/invite-subscription.payload.dto';
import { UpdateInvitationWithNotificationPayloadDto } from './dto/payload/update-invitation-with-notification.payload.dto';
import { UpdateSubscriptionDto } from './dto/payload/update-subscription.dto';
import { SuccessInviteSubscriptionResponseDto } from './dto/response/success-invite-subscription.response.dto';
import { UpdateInvitationWithNotificationResponseDto } from './dto/response/update-invitation-with-notification.response.dto';
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

  /**
   * 초대 메일 발송
   *
   * 초대 메일 검증 프로세스
   * 1. subscriptionId 존재 여부 검증
   * 2. emails 존재 여부 확인
   * 3. 구독 조직 내 emails 인원이 중복 확인
   * 4. 중복된다면 나머지는 발송하고 중복된 이메일은 반환
   * 5. 중복되지 않는다면 모두 발송
   * 6. 초대 메일 발송 후 받은 사람만 알림 발송
   *
   * @param user 로그인 유저
   * @param subscriptionId 구독 ID
   * @param inviteSubscriptionDto 초대 메일 발송 요청 DTO
   * @returns 초대 메일 발송 성공 응답 DTO
   */
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
  ): Promise<SuccessInviteSubscriptionResponseDto> {
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

    await this.subscriptionsService.addNotifications(+subscriptionId, NotificationType.Invitation, user.id, inviteSubscriptionDto.emails);

    return new SuccessInviteSubscriptionResponseDto();
  }

  @ApiOperation({ summary: '초대 승락 여부 수정' })
  @CombineResponses(HttpStatus.OK, UpdateInvitationWithNotificationResponseDto)
  @RequiredLogin
  @Transactional()
  @Patch(':subscriptionId/invite')
  async updateInvitationWithNotification(
    @LoginUser() user: LoginUserData,
    @Param('subscriptionId') subscriptionId: string,
    @Body() updateInvitationWithNotificationDto: UpdateInvitationWithNotificationPayloadDto,
  ): Promise<UpdateInvitationWithNotificationResponseDto> {
    await this.subscriptionsService.updateInvitationWithNotification(+subscriptionId, user.id, updateInvitationWithNotificationDto);
    return new UpdateInvitationWithNotificationResponseDto();
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSubscriptionDto: UpdateSubscriptionDto) {
    return this.subscriptionsService.update(+id, updateSubscriptionDto);
  }
}
