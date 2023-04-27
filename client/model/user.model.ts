import { callsModel } from "./calls.model";
import { chatList } from "./chat-list.model";
import { FriendModel } from "./friend.model";

export class userModel {
  public id: number;
  public name: string;
  public email: string;
  public password: string;
  public chatList: chatList[];
  public friends: FriendModel[];
  public img: string;
  public calls: callsModel[];

  constructor(id:number, name:string, email:string, password:string, chatList:chatList[], friends: FriendModel[], calls:callsModel[] = [], img:string = 'img') {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.chatList = chatList;
    this.friends = friends;
    this.calls = calls;
    this.img = img;
  }
}
