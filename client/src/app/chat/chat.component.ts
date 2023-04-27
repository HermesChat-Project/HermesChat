import { Component } from '@angular/core';
import { ChatSelectorService } from './chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatSelectorComponent {
  constructor(public chatSelector: ChatSelectorService) { }

  ngOnInit() {
    //create a option for a post request and send the cookie to the server
    let headers = new Headers();
    headers.append('Content-Type', 'application/json; charset=utf-8');
    headers.append('Authorization', localStorage.getItem("Authorization")!);
    let options = {
      headers: headers,
      observe: "response" as "response",
      withCredentials: true
    }
    console.log(options.headers.get('Cookie'));
    this.chatSelector.getFriends(options);
  }

  checkWhatShouldBeShown() {
    if(this.chatSelector.selectedChat || this.chatSelector.calendarSectionClicked)
      return true;
    else
     return false;
  }
}
