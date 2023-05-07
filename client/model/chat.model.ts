export class Chat {
  public _id: string;
  public users: { _id: string; image: string; nickname: string; }[];
  public flagGroup: boolean;
  //group properties (if flagGroup is true)
  public name: string;
  public image: string;
  public description: string;
  public creationDate: string;
  public last: string;
  public visibility: string;

  constructor(id: string, users: { _id: string; image: string; nickname: string; }[], flagGroup: boolean = false, groupName: string = "", groupImage: string = "", description: string = "", creationDate: string = "", last: string = "", visibility: string = "private") {
    this._id = id;
    this.users = users;
    this.flagGroup = flagGroup;
    this.name = groupName;
    this.image = groupImage;
    this.description = description;
    this.creationDate = creationDate;
    this.last = last;
    this.visibility = visibility;
  }
}
