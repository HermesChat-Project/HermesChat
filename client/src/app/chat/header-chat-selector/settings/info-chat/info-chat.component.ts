import { Component } from '@angular/core';
import { ChatSelectorService } from 'src/app/chat/chat.service';

@Component({
  selector: 'app-info-chat',
  templateUrl: './info-chat.component.html',
  styleUrls: ['./info-chat.component.css']
})
export class InfoChatComponent {
  constructor(public chatSelector:ChatSelectorService) { }

  closeInfoUser()
  {
    this.chatSelector.closeInfo()
  }

  changeTheme(theme : string){
    this.chatSelector.changeTheme(theme);
  }
}
