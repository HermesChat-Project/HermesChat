export class messageModel {
  public idUser: string;
  public content: string;
  public dateTime: string;
  public type: string;

  constructor( id_user:string,  mes:string, date:string, type:string) {
    this.idUser = id_user;
    this.content = mes;
    this.type = type;
    this.dateTime = date;
  }
}
