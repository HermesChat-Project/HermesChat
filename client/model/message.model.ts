export class messageModel {
  public _id: number;
  public id_sender: number;
  public name_sender: string;
  public message: string;
  public sentAt: Date;
  public type: string;
  public options: object;

  constructor(_id: number, id_user:number, name_sender: string,  mes:string, sentAt:Date, type:string = "text", options:object = {}) {
    this._id = _id;
    this.id_sender = id_user;
    this.message = mes;
    this.sentAt = sentAt;
    this.name_sender = name_sender;
    this.type = type;
    this.options = options;
  }
}
