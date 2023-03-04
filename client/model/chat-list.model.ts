export class chatList{
  public _id: number;
  public name : string;
  public info : string;
  public members: string[];
  public group: boolean;
  public Lastmessage : string;
  public LastmessageTime : Date;
  public img : string;
  public global_id_chat : number;

  constructor(id: number, id_chat: number, name:string, info:string,  img:string="img", group: boolean=false, members: string[]= [""], Lastmessage:string = "", LastmessageTime:Date=new Date()) {
    this._id = id;
    this.global_id_chat = id_chat;
    this.name = name;
    this.Lastmessage = Lastmessage;
    this.LastmessageTime = LastmessageTime;
    this.img = img;
    this.group = group;
    this.members = members;
    this.info = info;
  }
}
