import { Component } from '@angular/core';
import { ChatSelectorService } from '../../chat.service';
import { HeaderService } from '../header.service';

@Component({
  selector: 'app-create-chat',
  templateUrl: './create-chat.component.html',
  styleUrls: ['./create-chat.component.css']
})
export class CreateChatComponent {

  constructor(public headerService : HeaderService, public chatSelectorService:ChatSelectorService) { }
  closeCreateChat() {
    this.headerService.generalClosing();
  }

  changeSelection(type : number) {
    console.log(type);
    this.headerService.chatCreationType = type;
  }
}
