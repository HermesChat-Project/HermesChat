import { Component, Input } from '@angular/core';
import { FriendModel } from 'model/friendModel';
import { userModel } from 'model/user.model';

@Component({
  selector: 'app-friends-list',
  templateUrl: './friends-list.component.html',
  styleUrls: ['./friends-list.component.css']
})
export class FriendsListComponent {
  @Input() friendListUser!: FriendModel[];
  friendList: FriendModel[] = [];
  txtSearchFriends: string = '';
  reverse: boolean = false;


  ngOnInit(): void {
    this.friendListUser = this.friendListUser.sort((a, b) => a.name.localeCompare(b.name));
    this.friendList = this.friendListUser;
  }


  showFriends() {
    if (this.txtSearchFriends != '')
      this.friendList = this.friendListUser.filter((friend) => friend.name.toLowerCase().startsWith(this.txtSearchFriends.toLowerCase()));
    else
      this.friendList = this.friendListUser;
  }

  reverseList() {
    this.reverse = !this.reverse;
    this.friendList = this.friendList.reverse();//gira l'array
  }
}
