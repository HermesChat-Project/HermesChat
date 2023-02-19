export class CalendarModel{
  _id: number;
  title : string;
  date : Date;
  isPersonal : boolean;
  description: string;

  constructor(_id: number, title: string, date: Date, isPersonal: boolean, description: string) {
    this._id = _id;
    this.title = title;
    this.date = date;
    this.isPersonal = isPersonal;
    this.description = description;
  }

}
