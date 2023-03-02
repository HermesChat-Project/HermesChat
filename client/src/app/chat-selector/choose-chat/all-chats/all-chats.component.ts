import { Component, Input } from '@angular/core';
import { chatList } from 'model/chat-list.model';
import { userModel } from 'model/user.model';

@Component({
  selector: 'app-all-chats',
  templateUrl: './all-chats.component.html',
  styleUrls: ['./all-chats.component.css']
})
export class AllChatsComponent {
  @Input() chatListUser!: userModel;
  txtSearchChat: string = '';

  PersonalListSearch: chatList[] = [];
  ngOnInit() {
    this.chatListUser.chatList.sort((a, b) => b.LastmessageTime.getTime() - a.LastmessageTime.getTime());
    this.PersonalListSearch = this.chatListUser.chatList;
  }

  DateAdjustment(date: Date) {
    let dateMessage = this.GetDateWithoutTime(date);
    let today = new Date();
    let dateNow = this.GetDateWithoutTime(today);

    let hour: string = date.getHours().toString();
    let minute: string = date.getMinutes().toString();
    if (dateMessage != dateNow) {
      let diff = Math.abs(today.getTime() - date.getTime());
      // console.log(diff)
      let diffDays = Math.ceil(diff / (1000 * 3600 * 24));
      diffDays--;
      if (diffDays > 7) {
        return date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear();
      }
      else {
        if (diffDays == 1)
          return 'Ieri'
        else
          return diffDays + " giorni fa";
      }
    }
    else {
      if (hour.length < 2)
        hour = '0' + hour;
      if (minute.length < 2)
        minute = '0' + minute;
      return hour + ':' + minute;
    }
  }

  showChats() {
    if (this.txtSearchChat == '')
      this.PersonalListSearch = this.chatListUser.chatList;
    else {
      this.PersonalListSearch = this.chatListUser.chatList.filter((chat) => chat.name.toLowerCase().startsWith(this.txtSearchChat.toLowerCase())).sort((a, b) => a.LastmessageTime.getTime() - b.LastmessageTime.getTime());
    }
  }
  GetDateWithoutTime(date: Date) {
    return date.getFullYear() + "/" + date.getMonth() + "/" + date.getDate();
  }
}
