export class Chat {
  public _id: string;
  public users: { idUser: string; image: string; nickname: string; role:string }[];
  public flagGroup: boolean;
  //group properties (if flagGroup is true)
  public name: string;
  public image: string;
  public description: string;
  public creationDate: string;

  public visibility: string;
  public messages: any;

  constructor(id: string, users: { idUser: string; image: string; nickname: string; role: string}[], flagGroup: boolean = false, groupName: string = "", groupImage: string = "", description: string = "", creationDate: string = "", visibility: string = "private", messages: any = {}) {
    this._id = id;
    this.users = users;
    this.flagGroup = flagGroup;
    this.name = groupName;
    this.image = groupImage;
    this.description = description;
    this.creationDate = creationDate;
    this.visibility = visibility;
    this.messages = messages;
  }
}
