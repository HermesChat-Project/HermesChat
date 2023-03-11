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



  sendMsg() {
    this.messageSent = this.messageText.trimEnd()
    if (this.messageSent.length > 0) {
      console.log(this.messageSent)
      this.chatSelector.sendMessage(this.messageSent);
      this.messageText = '';
    }
  }

  keyAction(event: KeyboardEvent) {
    if (event.key == 'Enter' && !event.shiftKey) {
      this.sendMsg();
      event.preventDefault();
    }
  }


}
