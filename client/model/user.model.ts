import { callsModel } from "./calls.model";
import { chatList } from "./chat-list.model";

export class userModel {
  public id: number;
  public name: string;
  public email: string;
  public password: string;
  public chatList: chatList[];
  public friend_id: number[];
  public img: string;
  public calls: callsModel[];

  constructor(id:number, name:string, email:string, password:string, chatList:chatList[], id_friend:number[], calls:callsModel[] = [], img:string = 'img') {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.chatList = chatList;
    this.friend_id = id_friend;
    this.calls = calls;
    this.img = img;
  }
}
