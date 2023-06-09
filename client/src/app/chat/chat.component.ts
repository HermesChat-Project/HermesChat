import { Component } from '@angular/core';
import { ChatSelectorService } from './chat.service';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatSelectorComponent {
  constructor(public chatSelector: ChatSelectorService) { }

  ngOnInit() {
    //theme
    this.chatSelector.theme = localStorage.getItem('theme') || 'light';
    console.log(this.chatSelector.theme);

    //create a option for a post request and send the cookie to the server
    this.chatSelector.getInfo();
    this.chatSelector.getFriends();
    this.chatSelector.getReceivedRequests();
    this.chatSelector.getSentRequest()
    // this.chatSelector.getChats();
    this.chatSelector.startSocket();

  }

  checkWhatShouldBeShown() {
    if(this.chatSelector.selectedChat || this.chatSelector.calendarSectionClicked || this.chatSelector.selectedFriend)
      return true;
    else
     return false;
  }

  mouseEvent(event: MouseEvent){
    // console.log(event.target);
    // if(this.chatSelector.openOption)
    //   this.chatSelector.openOption = false;
    // if(this.chatSelector.user_action == 7)
    //   this.chatSelector.user_action = -1;
  }
}
