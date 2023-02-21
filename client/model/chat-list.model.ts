export class chatList{
  public _id: number;
  public name : string;
  public Lastmessage : string;
  public LastmessageTime : Date;
  public img : string;

  constructor(id: number, name:string, Lastmessage:string, LastmessageTime:Date, img:string) {
    this._id = id;
    this.name = name;
    this.Lastmessage = Lastmessage;
    this.LastmessageTime = LastmessageTime;
    this.img = img;
  }
}
