import { UserRole } from '../enums/user-role';
import { IUserSecret } from './iuser-secret';

export interface IUser {
  id: number;
  email: string;
  username: string;
  nickname: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  userSecret: IUserSecret;
}
