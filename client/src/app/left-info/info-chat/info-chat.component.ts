import { Component } from '@angular/core';
import { ChatSelectorService } from 'src/app/chat/chat.service';

@Component({
  selector: 'app-info-chat',
  templateUrl: './info-chat.component.html',
  styleUrls: ['./info-chat.component.css']
})
export class InfoChatComponent {
  constructor(public chatSelector: ChatSelectorService) { }

  closeInfo(){
    this.chatSelector.closeInfo();
  }

  leaveGroup(){
    this.chatSelector.leaveGroup();
  }

  report(){

  }
}
