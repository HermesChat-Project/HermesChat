import { Component } from '@angular/core';
import { messageModel } from 'model/message.model';
import { ChatSelectorService } from '../chat-selector.service';

@Component({
  selector: 'app-chat-view',
  templateUrl: './chat-view.component.html',
  styleUrls: ['./chat-view.component.css']
})
export class ChatViewComponent {
  showChatActions: boolean = false;
  messageText: string = '';
  messageSent: string = '';

  constructor(public chatSelector: ChatSelectorService) { }

  toggleShowChatActions() {
    this.showChatActions = !this.showChatActions;
  }
  hideShowChatActions() {
    this.showChatActions = false;
  }

  keyAction(event: KeyboardEvent) {
    if (event.key == 'Enter' && !event.shiftKey) {
      this.messageSent = this.messageText.trimEnd()
      if (this.messageSent.length > 0) {
        console.log(this.messageSent)
        this.chatSelector.sendMessage(this.messageSent);
        this.messageText = '';
      }
      event.preventDefault();
    }
  }

  alreadyTexted(i: number) {
    if (i != 0) {
      if (this.chatSelector.selectedChat?.messages[i].id_sender == this.chatSelector.selectedChat?.messages[i - 1].id_sender)
        return false;
      else
        return true;
    }
    return true;
  }

  DateView(date: Date) {
    /*get the yer, month and the day*/
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    return year + "/" + month + "/" + day;
  }

  fullDateView(date:Date){
    //get the string like : thursay, 09 march 2023
    return date.toLocaleDateString(this.chatSelector.userLang,{ weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  }

  differentDate(i: number) {
    if (i != 0) {
      if (this.DateView(this.chatSelector.selectedChat?.messages[i].sentAt as Date) == this.DateView(this.chatSelector.selectedChat?.messages[i - 1].sentAt as Date))
        return false;
      else
        return true;
    }
    return true;
  }



}
