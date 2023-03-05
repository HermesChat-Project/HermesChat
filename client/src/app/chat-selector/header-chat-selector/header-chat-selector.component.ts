import { Component, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-header-chat-selector',
  templateUrl: './header-chat-selector.component.html',
  styleUrls: ['./header-chat-selector.component.css']
})
export class HeaderChatSelectorComponent {
  @ViewChild('newChatOptions') newChatOptions!: ElementRef;
  showOptions:boolean = false;
  showUserProfile:boolean = false;

  ToggleNewChatOptions(){
    this.showOptions = !this.showOptions;
    console.log(document.activeElement);
  }
  HideNewChatOptions(){
    this.showOptions = false;
  }
  /*Settings events*/
  showProfile(){
    this.showUserProfile = !this.showUserProfile;
  }
  onCloseProfileEvent(){
    this.showUserProfile = false;
  }
}
