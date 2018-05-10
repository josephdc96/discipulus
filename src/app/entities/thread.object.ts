import {User} from './user.object';
import {Message} from './message.object';

export class Thread {
  messages: Message[];
  users: User[];
  name?: string;
  avatar?: string;
}
