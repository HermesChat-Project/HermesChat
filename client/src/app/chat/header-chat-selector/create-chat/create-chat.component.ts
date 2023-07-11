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

  possibleUser: string[] = [];

  txtGroupDesc: string = '';
  txtGroupName: string = '';
  imgGroup: File | null = null;
  base64Img: string = '';

  changeSelection(type: number) {

    this.headerService.chatCreationType = type;
  }



  updatePossibleUserArray(event: { friend: FriendModel, check: boolean }) {
    if (event.check) {
      this.possibleUser.push(event.friend.id);
    }
    else {
      this.possibleUser = this.possibleUser.filter((id) => {
        return id != event.friend.nickname;
      })
    }
  }

  createGroup() {
    if (this.possibleUser.length > 0 && this.txtGroupName != '' && this.txtGroupDesc != '' && this.imgGroup != null) {
      let body = {
        "name": this.txtGroupName,
        "description": this.txtGroupDesc,
        "img": this.base64Img,
        "users": this.possibleUser
      }

      this.chatSelectorService.createGroupChat(body);
    }
  }

  async getImg(event: Event) {
    if ((event.currentTarget as HTMLInputElement).files) {
      this.imgGroup = (event.currentTarget as HTMLInputElement).files![0];
      await this.createBase64ImageString(this.imgGroup).then((result) => {
        this.base64Img = result as string;
      })
    }
  }


  createBase64ImageString(file: File) {

    return new Promise((resolve, reject) => {
      var reader = new FileReader()
      reader.readAsDataURL(file);

      reader.onload = function () {

        resolve(reader.result)
      }
      reader.onerror = function (error) {

        reject(error)
      }
    })

  }


  createChat(friend: FriendModel) {
    if (!this.chatSelectorService.chatList.find((chat) => {
      return chat.name == friend.nickname && chat.flagGroup == false;
    })) {
      this.dialog.open(ChatCreationComponent, {
        "autoFocus": true,
        "data": friend.nickname
      }).afterClosed().subscribe((result) => {

        if (result) {
          this.chatSelectorService.createChat(friend);
        }
      })
    }
    else {
      this.chatSelectorService.selectedChat = this.chatSelectorService.chatList.find((chat) => {
        return chat.name == friend.nickname && chat.flagGroup == false;
      })!;
      this.chatSelectorService.getChatMessages({ "idChat": this.chatSelectorService.selectedChat._id, "offset": 1 }, this.chatSelectorService.selectedChat._id);

    }
  }

}
