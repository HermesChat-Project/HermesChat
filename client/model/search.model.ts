export class SearchModel {
  _id: number;
  name: string;
  info: string;
  img: string;
  group: boolean;
  members: string[];

  constructor(_id: number, name: string, info: string, img: string="img", group: boolean=false, members: string[]= [""]) {
    this._id = _id;
    this.name = name;
    this.info = info;
    this.img = img;
    this.group = group;
    this.members = members;
  }

}
