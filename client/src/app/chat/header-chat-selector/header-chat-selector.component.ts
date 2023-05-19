import { Component, ViewChild, ElementRef } from '@angular/core';
import { HeaderService } from './header.service';
import { ChatSelectorService } from '../chat.service';

@Component({
  selector: 'app-header-chat-selector',
  templateUrl: './header-chat-selector.component.html',
  styleUrls: ['./header-chat-selector.component.css']
})
export class HeaderChatSelectorComponent {
  showOptions:boolean = false;


  constructor(public headerService : HeaderService, public chatSelector: ChatSelectorService) { }
  /*chat creation options events*/
  ToggleNewChatOptions(){
    this.showOptions = !this.showOptions;
  }
  HideNewChatOptions(){
    this.showOptions = false;
  }

  /*Settings events*/
  showProfile(){
    this.headerService.typeOfAction = this.headerService.typeOfAction == 1 ? 0 : 1;
  }

  /*create chat events*/
  createChat(type:number){
    this.headerService.typeOfAction = 2;
    this.headerService.chatCreationType= type;
  }
  /*Friend request event*/
  ToggleFriendRequest(){
    this.headerService.typeOfAction = this.headerService.typeOfAction == 3 ? 0 : 3;
  }

  ToggleTempChat(){
    this.headerService.typeOfAction = this.headerService.typeOfAction == 4 ? 0 : 4;
  }

}
