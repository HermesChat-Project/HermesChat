import { Component } from '@angular/core';
import { chatList } from 'model/chat-list.model';
import { userModel } from 'model/user.model';

@Component({
  selector: 'app-choose-chat',
  templateUrl: './choose-chat.component.html',
  styleUrls: ['./choose-chat.component.css']
})
export class ChooseChatComponent {
  chatList = [
    new userModel(0, 'name', 'email', 'password', [new chatList('Prova', 'Lorem ipsum', new Date("2023/02/16 1:2:23"), 'img'),
    new chatList('Gruppo 1', 'Boh', new Date(), 'img'),
    new chatList('Gruppo 2', 'Ciao ', new Date(), 'img'),
    new chatList('Gruppo 3', 'Non so cosa scrivere', new Date(), 'img'),
    new chatList('Gruppo 4', 'DOTNET CORE', new Date(), 'img'),
    new chatList('Gruppo 5', 'Angular', new Date(), 'img'),
    new chatList('Gruppo 6', 'React', new Date(), 'img'),
    new chatList('Gruppo 7', 'Vue', new Date(), 'img'),
    new chatList('Gruppo 8', 'Node', new Date(), 'img'),
    new chatList('Gruppo 9', 'MongoDB', new Date(), 'img')]),
    //new userModel(1, 'name', 'email', 'password', [new chatList('Gruppo 2', 'Non so cosa scrivere', new Date(), 'img')]),
  ]
  day = new Date().getDate();
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
}
