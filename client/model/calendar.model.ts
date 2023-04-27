export class CalendarModel{
  _id: number;
  title : string;
  date : Date;
  isPersonal : boolean;
  description: string;
  color: string;
  notify: boolean;
  notifyTime: string

  constructor(_id: number, title: string, date: Date, isPersonal: boolean, description: string, color: string = "#1B7AF7", notify: boolean = true, notifyTime: string = "00:10") {
    this._id = _id;
    this.title = title;
    this.date = date;
    this.isPersonal = isPersonal;
    this.description = description;
    this.color = color;
    this.notify = notify;
    this.notifyTime = notifyTime;
  }

}
