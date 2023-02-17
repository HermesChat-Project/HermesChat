import { chatList } from "./chat-list.model";

export class userModel {
  public id: number;
  public name: string;
  public email: string;
  public password: string;
  public chatList: chatList[];

  constructor(id:number, name:string, email:string, password:string, chatList:chatList[]) {
    this.id = id;
    this.name = name;

    this.email = email;
    this.password = password;
    this.chatList = chatList;
  }
}
