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
}
