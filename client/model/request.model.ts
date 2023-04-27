export class requestModel{
  idUser: string;
  image: string;
  nickname: string;

  constructor(idUser: string, image: string, nickname: string){
    this.idUser = idUser;
    this.image = image;
    this.nickname = nickname;
  }
}
