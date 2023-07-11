export class FriendModel {
    public id: string;
    public name: string;
    public surname: string;
    public nickname: string;
    public image: string;

    constructor(idUser: string, name: string, surname: string,  nickname: string, image: string = "img") {
        this.id = idUser;
        this.surname = surname;
        this.name = name;
        this.nickname = nickname;
        this.image = image;
    }
}
