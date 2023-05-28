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

  possibleUser: FriendModel[] = [];

  txtGroupDesc: string = '';
  txtGroupName: string = '';
  imgGroup: File | null = null;

  changeSelection(type: number) {
    console.log(type);
    this.headerService.chatCreationType = type;
  }

  checkFriend(friend: FriendModel) {

  }

  updatePossibleUserArray(event: {friend: FriendModel, check: boolean }){
    if(event.check)
    {
      this.possibleUser.push(event.friend);
    }
    else
    {
      this.possibleUser = this.possibleUser.filter((friend) => {
        return friend.nickname != event.friend.nickname;
      })
    }
  }

  createGroup(){
    if(this.possibleUser.length > 0 && this.txtGroupName != '' && this.txtGroupDesc != '' && this.imgGroup != null)
    {
      let body = {
        "groupName": this.txtGroupName,
        "groupDesc": this.txtGroupDesc,
        "groupImage": this.imgGroup,
        "members" : this.possibleUser
      }
      this.chatSelectorService.createGroupChat(body);
    }
  }

  getImg(event: Event) {
    if((event.currentTarget as HTMLInputElement).files)
    {
      this.imgGroup = (event.currentTarget as HTMLInputElement).files![0];
    }
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
      this.chatSelectorService.getChatMessages({ "idChat": this.chatSelectorService.selectedChat._id, "offset": 1}, this.chatSelectorService.selectedChat._id);

    }
  }

}
