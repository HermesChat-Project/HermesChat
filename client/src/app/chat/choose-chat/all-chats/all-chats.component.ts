import { Component, Input, AfterViewChecked } from '@angular/core';
import { chatList } from 'model/chat-list.model';
import { SearchModel } from 'model/search.model';
import { userModel } from 'model/user.model';
import { ChatSelectorService } from '../../chat.service';
import { ViewEncapsulation } from '@angular/core';
import { Chat } from 'model/chat.model';

@Component({
  selector: 'app-all-chats',
  templateUrl: './all-chats.component.html',
  styleUrls: ['./all-chats.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AllChatsComponent {
  @Input() chatListUser!: userModel;
  txtSearchChat: string = '';






  constructor(public chatSelector: ChatSelectorService){}


  ngOnInit() {
    this.chatSelector.chatList.sort((a, b) => this.getLastMessageTime(b.last).getTime() - this.getLastMessageTime(a.last).getTime())
    this.chatSelector.PersonalListSearch = this.chatSelector.chatList;
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
      let diffDays = Math.floor(diff / (1000 * 3600 * 24));

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
    if (this.txtSearchChat.length < 3) {
      this.chatSelector.PersonalListSearch = this.chatSelector.chatList;
      this.chatSelector.OtherListSerach = [];
    }
    else {
      this.chatSelector.getSerachUsers(this.txtSearchChat)
    }
  }
  GetDateWithoutTime(date: Date) {
    return date.getFullYear() + "/" + date.getMonth() + "/" + date.getDate();
  }



  getLastMessageTime(message: any): Date {
    return new Date(message.dateTime);
  }

  showEntireChat(selected : Chat){
    this.chatSelector.selectedChat = selected;
    let body = {
      idChat: selected._id,
      offset: 1,
    }

    this.chatSelector.getChatMessages(body, selected._id);
    // this.chatSelector.getChatMessages(selected);
    // setTimeout(() => {
    // this.chatSelector.bottomScroll()
    // }, 0);//to improve
  }

  sendRequest(user: SearchModel) {
    this.chatSelector.sendFriendRequest(user);
  }




}
