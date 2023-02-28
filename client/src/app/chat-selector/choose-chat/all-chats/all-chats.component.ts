import { Component, Input } from '@angular/core';
import { chatList } from 'model/chat-list.model';
import { userModel } from 'model/user.model';

@Component({
  selector: 'app-all-chats',
  templateUrl: './all-chats.component.html',
  styleUrls: ['./all-chats.component.css']
})
export class AllChatsComponent {
  @Input() chatList!: userModel;
  txtSearchChat: string = '';

  filteredList: chatList[] = [];


  DateAdjustment(date: Date) {
    let today = date.getDate();
    let hour: string = date.getHours().toString();
    let minute: string = date.getMinutes().toString();
    if (today + 1 == new Date().getDate())
      return 'ieri';
    else {
      if (hour.length < 2)
        hour = '0' + hour;
      if (minute.length < 2)
        minute = '0' + minute;
      return hour + ':' + minute;
    }
  }

  showChats(){
    if(this.txtSearchChat == '')
      this.filteredList = this.chatList.chatList;
    else
    {
      this.filteredList = this.chatList.chatList.filter((chat) => chat.name.toLowerCase().startsWith(this.txtSearchChat.toLowerCase()));
    }
  }
}
