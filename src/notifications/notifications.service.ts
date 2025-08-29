import { Injectable } from '@nestjs/common';
import { NotificationSearchParamDto } from './dto/param/notification-search.param.dto';
import { CreateNotificationPayloadDto } from './dto/payload/create-notification.payload.dto';
import { ToggleReadNotificationPayloadDto } from './dto/payload/toggle-read-notification.payload.dto';
import { GetNotificationPaginatedNestedResponseDto } from './dto/response/get-notification-paginated.nested.response.dto';
import { NotificationsRepository } from './notifications.repository';

@Injectable()
export class NotificationsService {
  constructor(private readonly notificationsRepository: NotificationsRepository) {}

  async findAll(userId: number, searchQuery: NotificationSearchParamDto): Promise<GetNotificationPaginatedNestedResponseDto> {
    return this.notificationsRepository.findAll(userId, searchQuery);
  }

  createNotification(fromId: number, createNotificationDto: CreateNotificationPayloadDto) {
    return this.notificationsRepository.createNotification(fromId, createNotificationDto);
  }

  async toggleReadNotification(userId: number, id: number, toggleReadNotificationDto: ToggleReadNotificationPayloadDto) {
    await this.notificationsRepository.toggleReadNotification(userId, id, toggleReadNotificationDto);
  }
}
