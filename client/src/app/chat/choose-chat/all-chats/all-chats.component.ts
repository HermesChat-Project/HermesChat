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


  OtherListSerach: SearchModel[] = [];

  totalUser: SearchModel[] = [
    new SearchModel(0, 'Prova', 'Ciao come stai?', 'img'),
    new SearchModel(1, 'Mario', 'Ciao come stai?', 'img'),
    new SearchModel(2, 'Luigi', 'Ciao come stai?', 'img'),
    new SearchModel(3, 'Pippo', 'Ciao come stai?', 'img'),
    new SearchModel(4, 'Pluto', 'Ciao come stai?', 'img'),
    new SearchModel(5, 'Paperino', 'Ciao come stai?', 'img'),
    new SearchModel(6, 'Paperone', 'Ciao come stai?', 'img'),
    new SearchModel(7, 'Topolino', 'Ciao come stai?', 'img'),
    new SearchModel(8, 'Minnie', 'Ciao come stai?', 'img'),
    new SearchModel(9, 'Paperoga', 'Ciao come stai?', 'img'),
    new SearchModel(10, 'Paperina', 'Ciao come stai?', 'img'),
    new SearchModel(11, 'Paperon de Paperoni', 'Ciao come stai?', 'img'),
    new SearchModel(12, "Qui", 'Ciao come stai?', 'img'),
    new SearchModel(13, "Quo", 'Ciao come stai?', 'img'),
    new SearchModel(14, "Qua", 'Ciao come stai?', 'img'),
    new SearchModel(15, "Gruppo 1", 'Gruppo di prova', 'img', true, ['Mario', 'Luigi']),
    new SearchModel(16, "Gruppo 2", 'Gruppo di prova', 'img', true, ['Mario', 'Pippo']),
    new SearchModel(17, "Gruppo 3", 'Gruppo di prova', 'img', true, ['Mario', 'Paperino', 'Pluto']),
    new SearchModel(18, "Gruppo 4", 'Gruppo di prova', 'img', true, ['Mario', 'Qui', 'Quo', 'Qua']),
    new SearchModel(19, "Gruppo 5", 'Gruppo di prova', 'img', true, ['Mario', 'Luigi', 'Pippo']),
    new SearchModel(20, "Gruppo 6", 'Gruppo di prova', 'img', true, ['Mario', 'Luigi', 'Paperino']),
    new SearchModel(21, "Gruppo 7", 'Gruppo di prova', 'img', true, ['Mario', 'Luigi', 'Pluto']),
    new SearchModel(22, "Gruppo 8", 'Gruppo di prova', 'img', true, ['Mario', 'Luigi', 'Paperone']),
    new SearchModel(23, "Gruppo 9", 'Gruppo di prova', 'img', true, ['Mario', 'Luigi', 'Topolino']),
    new SearchModel(24, "Gruppo 10", 'Gruppo di prova', 'img', true, ['Mario', 'Luigi', 'Minnie', 'Paperoga']),
    new SearchModel(25, "Gruppo 11", 'Gruppo di prova', 'img', true, ['Mario', 'Luigi', 'Paperina']),
    new SearchModel(26, "Gruppo 12", 'Gruppo di prova', 'img', true, ['Mario', 'Luigi', 'Paperon de Paperoni']),
    new SearchModel(27, "Gruppo 13", 'Gruppo di prova', 'img', true, ['Mario', 'Luigi', 'Qui']),
    new SearchModel(28, "Gruppo 14", 'Gruppo di prova', 'img', true, ['Mario', 'Luigi', 'Quo', 'Qua', 'Paperone'])
  ]

  constructor(public chatSelector: ChatSelectorService){}


  ngOnInit() {
    this.chatSelector.chatExampleList.sort((a, b) => this.getLastMessageTime(b.last).getTime() - this.getLastMessageTime(a.last).getTime())
    this.chatSelector.PersonalListSearch = this.chatSelector.chatExampleList;
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
      this.chatSelector.PersonalListSearch = this.chatSelector.chatExampleList;
      this.OtherListSerach = [];
    }
    else {
      this.chatSelector.PersonalListSearch = this.chatSelector.chatExampleList.filter((chat) => chat.name.toLowerCase().startsWith(this.txtSearchChat.toLowerCase())).sort((a, b) => this.getLastMessageTime(a.last).getTime() - this.getLastMessageTime(b.last).getTime());
      this.OtherListSerach = this.totalUser.filter((chat) => chat.name.toLowerCase().startsWith(this.txtSearchChat.toLowerCase()))
      console.log(this.chatSelector.PersonalListSearch)
    }
  }
  GetDateWithoutTime(date: Date) {
    return date.getFullYear() + "/" + date.getMonth() + "/" + date.getDate();
  }



  getLastMessageTime(last: string): Date {
    return new Date(last);
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




}
