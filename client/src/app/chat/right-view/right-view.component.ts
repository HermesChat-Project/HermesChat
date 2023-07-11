import { Component } from '@angular/core';
import { ChatSelectorService } from '../chat.service';

@Component({
  selector: 'app-right-view',
  templateUrl: './right-view.component.html',
  styleUrls: ['./right-view.component.css']
})
export class RightViewComponent {
  constructor(public chatSelector: ChatSelectorService){}

  isCalendarClicked(){
    if(this.chatSelector.selectedChat && !this.chatSelector.calendarSectionClicked)
      return 1;
    else
      if(this.chatSelector.selectedChat && this.chatSelector.calendarSectionClicked)
        return 2;
      else
        return 0;
  }

  isFriendClicked(){
    return this.chatSelector.selectedFriend != null;
  }
}
