export class messageModel {
  public id: number = 0;
  public id_chat: number;
  public id_sender: number;
  public message: string;
  public isRead: boolean;
  public sentAt: Date;

  constructor(id_chat:number, id_user:number, mes:string, sentAt:Date, isRead:boolean) {
    this.id_chat = id_chat;
    this.id_sender = id_user;
    this.message = mes;
    this.sentAt = sentAt
    this.isRead = isRead;
  }
}
