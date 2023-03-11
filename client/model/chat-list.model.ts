import { messageModel } from "./message.model";

export class chatList{
  public _id: number;
  public name : string;
  public info : string;
  public members: string[];
  public group: boolean;
  public messages : messageModel[]
  public img : string;
  public global_id_chat : number;

  constructor(id: number, id_chat: number, name:string, info:string,  img:string="img", messages:messageModel[] = [],  group: boolean=false, members: string[]= [""]) {
    this._id = id;
    this.global_id_chat = id_chat;
    this.name = name;
    this.img = img;
    this.group = group;
    this.members = members;
    this.info = info;
    this.messages = messages;
  }
}
