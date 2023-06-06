import { Component } from '@angular/core';
import { ChatSelectorService } from 'src/app/chat/chat.service';

@Component({
  selector: 'app-info-type-options',
  templateUrl: './info-type-options.component.html',
  styleUrls: ['./info-type-options.component.css']
})
export class InfoTypeOptionsComponent {
  constructor(public chatSelector:ChatSelectorService) { }

  closeInfoUser()
  {
    this.chatSelector.closeInfo()
  }

  changeTheme(theme : string){
    this.chatSelector.changeTheme(theme);
  }
}
