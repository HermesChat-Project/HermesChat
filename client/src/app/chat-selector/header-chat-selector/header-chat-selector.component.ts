import { Component, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-header-chat-selector',
  templateUrl: './header-chat-selector.component.html',
  styleUrls: ['./header-chat-selector.component.css']
})
export class HeaderChatSelectorComponent {
  showOptions:boolean = false;
  typeSection:number = 0;//0: none, 1: settings, 2: new chat, 3 friends requests
  /*chat creation options events*/
  ToggleNewChatOptions(){
    this.showOptions = !this.showOptions;
  }
  HideNewChatOptions(){
    this.showOptions = false;
  }

  /*Settings events*/
  showProfile(){
    this.typeSection = this.typeSection == 1 ? 0 : 1;
  }
  onCloseProfileEvent(){
    this.typeSection = 0;
  }

  /*create chat events*/
  createChat(type:number){
    this.typeSection = this.typeSection == 2 ? 0 : 2;
    //console.log(document.activeElement);
  }
  /*Friend request event*/
  ToggleFriendRequest(){
    this.typeSection = this.typeSection == 3 ? 0 : 3;
  }

  onCloseEvent(){
    this.typeSection = 0;
  }
}
