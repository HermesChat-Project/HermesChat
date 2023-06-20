import { Component, Input, AfterViewChecked } from '@angular/core';
import { chatList } from 'model/chat-list.model';
import { SearchModel } from 'model/search.model';
import { userModel } from 'model/user.model';
import { ChatSelectorService } from '../../chat.service';
import { ViewEncapsulation } from '@angular/core';
import { Chat } from 'model/chat.model';
import { TranslationsService } from 'src/app/shared/translations.service';


@Component({
  selector: 'app-all-chats',
  templateUrl: './all-chats.component.html',
  styleUrls: ['./all-chats.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AllChatsComponent {
  @Input() chatListUser!: userModel;
  txtSearchChat: string = '';

  constructor(public chatSelector: ChatSelectorService, public translationService: TranslationsService) { }


  ngOnInit() {
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
      let diffDays = Math.ceil(diff / (1000 * 3600 * 24));
      if (!isNaN(diffDays)) {
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
      return '';

    }
    else {
      if (hour.length < 2)
        hour = '0' + hour;
      if (minute.length < 2)
        minute = '0' + minute;
      return hour + ':' + minute;
    }
  }

  searchChats() {
    if (this.txtSearchChat.length < 3) {
      this.chatSelector.PersonalListSearch = this.chatSelector.chatList;
      this.chatSelector.OtherListSerach = [];
    }
    else {
      this.chatSelector.PersonalListSearch = this.chatSelector.chatList.filter(x => x.name.toLowerCase().startsWith(this.txtSearchChat.toLowerCase()));
      this.chatSelector.getSearchUsers(this.txtSearchChat)
    }
  }

  checkUser(user: SearchModel) {
    if (this.chatSelector.friendList.find(x => x.id == user._id))
      return 1
    if (this.chatSelector.receivedList.find(x => x.idUser == user._id))
      return 2;
    if (this.chatSelector.sentList.find(x => x.idUser == user._id))
      return 3;
    return 0;
  }

  GetDateWithoutTime(date: Date) {
    return date.getFullYear() + "/" + date.getMonth() + "/" + date.getDate();
  }
  getLastMessage(chat: Chat) {
    let lastMessage: { content: string; dateTime: string; idUser: string; type: string; options: any; } = chat.messages;
    if (this.chatSelector.socketMessageList[chat._id]?.length > 0)
      lastMessage = this.chatSelector.socketMessageList[chat._id][this.chatSelector.socketMessageList[chat._id].length - 1].messages;
    else if (this.chatSelector.messageList[chat._id]?.length > 0)
      lastMessage = this.chatSelector.messageList[chat._id][this.chatSelector.messageList[chat._id].length - 1].messages;
    if (lastMessage?.type == "chart") {
      return "&#128200; " + (lastMessage.options.title?.text || this.translationService.languageWords["chart"] || "chart");
    }
    else if (lastMessage?.type == "survey")
      return "&#128200; " + (this.translationService.languageWords["survey"] || "survey");
    if (lastMessage?.type == "text") {
      let ausEl = document.createElement('div');
      ausEl.innerHTML = lastMessage.content;
      let imageLength = ausEl.getElementsByTagName("img").length;
      if (imageLength > 0 && ausEl.innerText.length == 0) {
        let msg = "&#128247;";
        let n_image_msg: string = imageLength > 9 ? "9+" : imageLength.toString();
        msg += imageLength == 1 ? (this.translationService.languageWords["image"] || "image") : n_image_msg + " " + (this.translationService.languageWords["images"] || "images");
        return msg;
      }
      else {
        if (imageLength > 0) {
          let msg = "&#128247;";
          let n_image_msg: string = imageLength > 9 ? "9+" : imageLength.toString();
          msg += imageLength == 1 ? ausEl.innerText : n_image_msg + " " + ausEl.innerText;
          return msg;

        }
      }
    }
    return lastMessage.content;
  }


  getLastMessageTime(message: any): Date {
    return new Date(message.dateTime);
  }

  showEntireChat(selected: Chat) {
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
