import { NotificationType } from '@share/enums/notification-type';

export class AddNotificationPayloadDto {
  fromId!: number;
  toId!: number;
  type!: NotificationType | null;
  referenceId!: number | null;
  title!: string;
  content!: string | null;
}
