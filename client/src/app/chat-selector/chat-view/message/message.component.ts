import { Component, Input } from '@angular/core';
import { messageModel } from 'model/message.model';
import { ChatSelectorService } from '../../chat-selector.service';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent {
  @Input() chatMessage!: messageModel
  @Input() index!: number;
  messageActions: boolean = false;

  constructor(public chatSelector: ChatSelectorService) { }

  alreadyTexted(i: number) {
    if (i != 0) {
      if (this.chatSelector.selectedChat?.messages[i].id_sender == this.chatSelector.selectedChat?.messages[i - 1].id_sender && !this.differentDate(i))
        return false;
      else
        return true;
    }
    return true;
  }

  toggleMessageActions() {
    this.messageActions = !this.messageActions;
  }

  DateView(date: Date) {
    /*get the yer, month and the day*/
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    return year + "/" + month + "/" + day;
  }

  fullDateView(date: Date) {
    //get the string like : thursay, 09 march 2023
    return date.toLocaleDateString(this.chatSelector.userLang, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  }

  differentDate(i: number) {
    if (i != 0) {
      if (this.DateView(this.chatSelector.selectedChat?.messages[i].sentAt as Date) == this.DateView(this.chatSelector.selectedChat?.messages[i - 1].sentAt as Date))
        return false;
      else
        return true;
    }
    return true;
  }

  getTimeFormatted(date: Date) {
    let hours = date.getHours().toString();
    let minutes = date.getMinutes().toString();
    if (minutes.length == 1)
      minutes = "0" + minutes;
    if (hours.length == 1)
      hours = "0" + hours;
    return hours + ":" + minutes;
  }
}
