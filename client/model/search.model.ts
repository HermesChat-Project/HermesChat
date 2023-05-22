export class SearchModel {
  _id: number;
  nickname: string;
  info: string;
  image: string;
  group: boolean;
  members: string[];

  constructor(_id: number, name: string, info: string, img: string="img", group: boolean=false, members: string[]= [""]) {
    this._id = _id;
    this.nickname = name;
    this.info = info;
    this.image = img;
    this.group = group;
    this.members = members;
  }

}
