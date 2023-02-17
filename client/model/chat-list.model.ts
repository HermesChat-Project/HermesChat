export class chatList{
  public _id: number = 0;
  public name : string;
  public Lastmessage : string;
  public LastmessageTime : Date;
  public img : string;

  constructor(name:string, Lastmessage:string, LastmessageTime:Date, img:string) {
    this.name = name;
    this.Lastmessage = Lastmessage;
    this.LastmessageTime = LastmessageTime;
    this.img = img;
  }
}
