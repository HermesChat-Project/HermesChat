export class FriendModel {
    public id: number;
    public name: string;
    public nickname: string;
    public image: string;

    constructor(idUser: number, name: string, nickname: string, image: string = "img") {
        this.id = idUser;
        this.name = name;
        this.nickname = nickname;
        this.image = image;
    }
}
