import { Component, Input } from '@angular/core';
import { userModel } from 'model/user.model';

@Component({
  selector: 'app-friends-list',
  templateUrl: './friends-list.component.html',
  styleUrls: ['./friends-list.component.css']
})
export class FriendsListComponent {
  @Input() friendListUser!: userModel[];
  list: any[] = [];
  friendList: any[] = [];
  txtSearchFriends: string = '';
  reverse: boolean = false;


  ngOnInit(): void {
    this.getFriendListOf(0);
    this.list.sort((a, b) => a.name.localeCompare(b.name));
    this.friendList = this.list;
  }

  getFriendListOf(id: number) {
    let id_array: number[] = this.friendListUser[id].friend_id;
    this.list = id_array.map((id) => this.friendListUser[id]);
  }

  showFriends() {
    if (this.txtSearchFriends == '')
      this.friendList = this.list;
    else
      this.friendList = this.list.filter((friend) => friend.name.toLowerCase().startsWith(this.txtSearchFriends.toLowerCase()));

  }

  reverseList() {
    this.reverse = !this.reverse;
    this.friendList = this.friendList.reverse();//gira l'array
  }
}
