import {Time} from '@angular/common';
import {IAttachment} from './attachment.object';

export class Message {
  attachments?: IAttachment[];
  content: string;
  from: string;
  send_time: Time;
}
