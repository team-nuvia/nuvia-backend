import { IUser } from './iuser';

export interface IUserSecret {
  id: number;
  userId: number;
  password: string;
  salt: string;
  iteration: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  user: IUser;
}
