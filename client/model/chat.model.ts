import { messageModel } from "./message.model";

export class chatModel {
  public id: number;
  public members: number[];
  public message: messageModel[];


  constructor(id_chat:number, mes:messageModel[], mebers: number[], id:number ) {
    this.id = id;
    this.message = mes;
    this.members = mebers;
  }
}
