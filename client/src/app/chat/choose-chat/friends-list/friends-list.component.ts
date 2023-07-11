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
      this.chatSelector.friendSerachList = this.chatSelector.friendList.filter((friend) => friend.nickname.toLowerCase().startsWith(this.txtSearchFriends.toLowerCase()));
    else
      this.chatSelector.friendSerachList = this.chatSelector.friendList;
  }

  reverseList() {
    this.reverse = !this.reverse;
    this.chatSelector.friendSerachList = this.chatSelector.friendSerachList.reverse();//gira l'array
  }

  seeDetails(friend: FriendModel) {
    this.chatSelector.selectedChat = null;
    this.chatSelector.selectedFriend = friend;

  }

  createChat(friend: FriendModel) {
    if (!this.chatSelector.chatList.find((chat) => {
      return chat.name == friend.nickname && chat.flagGroup == false;
    })) {
      this.chatSelector.createChat(friend);
    }
    else {
      this.chatSelector.selectedChat = this.chatSelector.chatList.find((chat) => {
        return chat.name == friend.nickname && chat.flagGroup == false;
      })!;

      this.chatSelector.getChatMessages({ idChat: this.chatSelector.selectedChat._id, offset: 1 }, this.chatSelector.selectedChat._id);
      this.chatSelector.selectedFriend = null;
    }
  }
}
