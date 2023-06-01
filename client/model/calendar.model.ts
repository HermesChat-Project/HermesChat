export class CalendarModel{
  title : string;
  dateTime : string;
  date: Date;
  type : string;
  description: string;
  color: string;
  notify: boolean;
  notifyTime: string
  idUser: string;
  idChats: Array<string>|null;

  constructor( title: string, description: string, idUser: string,date: Date,  dateTime: string, type: string,  color: string = "#1B7AF7", notify: boolean = true, notifyTime: string = "00:10", idChat: Array<string>|null = null) {

    this.title = title;
    this.description = description;
    this.idUser = idUser;
    this.date = date;
    this.dateTime = dateTime;
    this.type = type;
    this.color = color;
    this.notify = notify;
    this.notifyTime = notifyTime;
    this.idChats = idChat;
  }

}
