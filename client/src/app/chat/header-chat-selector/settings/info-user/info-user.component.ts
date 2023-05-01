import { Component } from '@angular/core';
import { ChatSelectorService } from 'src/app/chat/chat.service';

@Component({
  selector: 'app-info-user',
  templateUrl: './info-user.component.html',
  styleUrls: ['./info-user.component.css']
})
export class InfoUserComponent {

  constructor(public chatSelector:ChatSelectorService) { }

  closeInfoUser()
  {
    this.chatSelector.user_action = -1;
  }
}
