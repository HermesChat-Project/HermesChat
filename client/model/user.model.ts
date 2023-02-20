import { chatList } from "./chat-list.model";

export class userModel {
  public id: number;
  public name: string;
  public email: string;
  public password: string;
  public chatList: chatList[];
  public friend_id: number[];
  public img: string;

  constructor(id:number, name:string, email:string, password:string, chatList:chatList[], id_friend:number[], img:string = 'img') {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.chatList = chatList;
    this.friend_id = id_friend;
    this.img = img;
  }
}
