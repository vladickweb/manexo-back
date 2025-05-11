import { User } from '../../user/entities/user.entity';

declare module 'express' {
  interface Request {
    user?: User;
  }
}
