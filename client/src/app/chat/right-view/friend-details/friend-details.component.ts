import { Component } from '@angular/core';
import { ChatSelectorService } from '../../chat.service';
import { FriendModel } from 'model/friend.model';

@Component({
  selector: 'app-friend-details',
  templateUrl: './friend-details.component.html',
  styleUrls: ['./friend-details.component.css']
})
export class FriendDetailsComponent {
  constructor(public chatSelector: ChatSelectorService) { }

  createChat(selectedFriend: FriendModel) {
    if (!this.chatSelector.chatList.find((chat) => {
      return chat.name == selectedFriend.nickname && chat.flagGroup == false;
    })) {
      this.chatSelector.createChat(selectedFriend);
    }
    else {
      this.chatSelector.selectedChat = this.chatSelector.chatList.find((chat) => {
        return chat.name == selectedFriend.nickname && chat.flagGroup == false;
      })!;

      this.chatSelector.getChatMessages({ idChat: this.chatSelector.selectedChat._id, offset: 1 }, this.chatSelector.selectedChat._id);
      this.chatSelector.selectedFriend = null;
    }
  }
}
