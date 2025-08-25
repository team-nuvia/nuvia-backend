import { CombineResponses } from '@common/decorator/combine-responses.decorator';
import { LoginUser } from '@common/decorator/login-user.param.decorator';
import { RequiredLogin } from '@common/decorator/required-login.decorator';
import { Body, Controller, Get, HttpStatus, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { NotificationSearchParamDto } from './dto/param/notification-search.param.dto';
import { CreateNotificationPayloadDto } from './dto/payload/create-notification.payload.dto';
import { ToggleReadNotificationPayloadDto } from './dto/payload/toggle-read-notification.payload.dto';
import { GetNotificationResponseDto } from './dto/response/get-notification.response.dto';
import { ToggleReadNotificationResponseDto } from './dto/response/toggle-read-notification.response.dto';
import { NotificationsService } from './notifications.service';

@ApiTags('알림')
@Controller('notifications')
@RequiredLogin
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @ApiOperation({ summary: '내 알림 조회' })
  @CombineResponses(HttpStatus.OK, GetNotificationResponseDto)
  @Get('me')
  async findAll(@LoginUser() user: LoginUserData, @Query() searchQuery: NotificationSearchParamDto) {
    const notifications = await this.notificationsService.findAll(user.id, searchQuery);
    return new GetNotificationResponseDto(notifications);
  }

  @Post()
  createNotification(@LoginUser() fromUser: LoginUserData, @Body() createNotificationDto: CreateNotificationPayloadDto) {
    return this.notificationsService.createNotification(fromUser.id, createNotificationDto);
  }

  @Patch(':id/read')
  async toggleReadNotification(
    @LoginUser() user: LoginUserData,
    @Param('id') id: number,
    @Body() toggleReadNotificationDto: ToggleReadNotificationPayloadDto,
  ) {
    await this.notificationsService.toggleReadNotification(user.id, id, toggleReadNotificationDto);
    return new ToggleReadNotificationResponseDto();
  }
}
