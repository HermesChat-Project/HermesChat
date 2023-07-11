export class requestModel{
  idUser: string;
  image: string;
  nickname: string;
  name: string;
  surname: string;

  constructor(idUser: string, image: string, nickname: string, name: string, surname: string){
    this.idUser = idUser;
    this.image = image;
    this.nickname = nickname;
    this.name = name;
    this.surname = surname;
  }
}
