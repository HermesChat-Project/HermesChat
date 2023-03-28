export class FriendModel {
    public idUser: number;
    public name: string;
    public surname: string;
    public nickname: string;
    public image: string;

    constructor(idUser: number, name: string, surname: string, nickname: string, image: string = "img") {
        this.idUser = idUser;
        this.name = name;
        this.surname = surname;
        this.nickname = nickname;
        this.image = image;
    }
}
