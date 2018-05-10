export interface IAttachment { }

export class Attachment<T> implements IAttachment {
  type: AttachmentType;
  content: T;
}

export enum AttachmentType {
  Image = 0, Video, GIF, Document, Contact
}
