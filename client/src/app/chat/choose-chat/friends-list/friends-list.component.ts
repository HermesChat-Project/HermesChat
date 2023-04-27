import { Component, Input } from '@angular/core';
import { FriendModel } from 'model/friend.model';
import { userModel } from 'model/user.model';
import { ChatSelectorService } from '../../chat.service';

@Component({
  selector: 'app-friends-list',
  templateUrl: './friends-list.component.html',
  styleUrls: ['./friends-list.component.css']
})
export class FriendsListComponent {

  txtSearchFriends: string = '';
  reverse: boolean = false;

  constructor(public chatSelector: ChatSelectorService) { }




  showFriends() {
    console.log(this.txtSearchFriends);
    if (this.txtSearchFriends != '')
      this.chatSelector.friendSerachList = this.chatSelector.friendList.filter((friend) => friend.name.toLowerCase().startsWith(this.txtSearchFriends.toLowerCase()));
    else
      this.chatSelector.friendSerachList = this.chatSelector.friendList;
  }

  reverseList() {
    this.reverse = !this.reverse;
    this.chatSelector.friendSerachList = this.chatSelector.friendSerachList.reverse();//gira l'array
  }
}
