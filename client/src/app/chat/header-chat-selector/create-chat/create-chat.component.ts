import { Component } from '@angular/core';
import { ChatSelectorService } from '../../chat.service';
import { HeaderService } from '../header.service';
import { FriendModel } from 'model/friend.model';
import { MatDialog } from '@angular/material/dialog';
import { ChatCreationComponent } from 'src/app/dialog/chat-creation/chat-creation.component';

@Component({
  selector: 'app-create-chat',
  templateUrl: './create-chat.component.html',
  styleUrls: ['./create-chat.component.css']
})
export class CreateChatComponent {

  constructor(public headerService: HeaderService, public chatSelectorService: ChatSelectorService, private dialog: MatDialog) { }
  closeCreateChat() {
    this.headerService.generalClosing();
  }

  changeSelection(type: number) {
    console.log(type);
    this.headerService.chatCreationType = type;
  }

  checkFriend(friend: FriendModel) {

  }

  createChat(friend: FriendModel) {
    if (!this.chatSelectorService.chatList.find((chat) => {
      return chat.name == friend.nickname && chat.flagGroup == false;
    })) {
      this.dialog.open(ChatCreationComponent, {
        "autoFocus": true,
        "data": friend.nickname
      }).afterClosed().subscribe((result) => {
        console.log(result);
        if (result) {
          this.chatSelectorService.createChat(friend);
        }
      })
    }
    else
    {
      this.chatSelectorService.selectedChat = this.chatSelectorService.chatList.find((chat) => {
        return chat.name == friend.nickname && chat.flagGroup == false;
      })!;

    }
  }

}
