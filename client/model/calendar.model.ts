export class CalendarModel{
  _id: string;
  title : string;
  dateTime : string;
  date: Date = new Date();
  type : string;
  description: string;
  color: string;
  notify: boolean;
  notifyTime: string
  idUser: string;
  idChat: string|Array<string>|null;

  constructor(_id: string, title: string, description: string, idUser: string,  date: string, type: string,  color: string = "#1B7AF7", notify: boolean = true, notifyTime: string = "00:10", idChat: string|Array<string>|null = null) {
    this._id = _id;
    this.title = title;
    this.description = description;
    this.idUser = idUser;
    this.dateTime = date;
    this.type = type;
    this.color = color;
    this.notify = notify;
    this.notifyTime = notifyTime;
    this.idChat = idChat;
  }

}
