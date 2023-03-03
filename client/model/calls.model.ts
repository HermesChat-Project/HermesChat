export class callsModel {
  public _id: number;
  public id_user: number;
  public id_receiver: number;
  public date: Date;
  public type: number;// 0 - missed, 1 - incoming, 2 - outgoing
  public name_receiver: string = '';
  public img_receiver: string = '';

  constructor(id: number, id_user: number, id_receiver: number, date: Date, type: number) {
    this._id = id;
    this.id_user = id_user;
    this.id_receiver = id_receiver;
    this.date = date;
    this.type = type;
  }
}
