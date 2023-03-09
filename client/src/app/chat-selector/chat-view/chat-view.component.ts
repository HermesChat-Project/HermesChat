import { Component } from '@angular/core';

@Component({
  selector: 'app-chat-view',
  templateUrl: './chat-view.component.html',
  styleUrls: ['./chat-view.component.css']
})
export class ChatViewComponent {
  showChatActions: boolean = false;
  messageText: string = '';
  messageSent: string = '';

  toggleShowChatActions() {
    this.showChatActions = !this.showChatActions;
  }
  hideShowChatActions() {
    this.showChatActions = false;
  }

  keyAction(event: KeyboardEvent) {
    if (event.key == 'Enter' && !event.shiftKey) {
      this.messageSent = this.messageText.trimEnd()
      if(this.messageSent.length > 0) {
        console.log(this.messageSent)
        this.messageText = '';
      }
      event.preventDefault();
    }
  }



}
