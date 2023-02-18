import { Component, Input } from '@angular/core';
import { userModel } from 'model/user.model';

@Component({
  selector: 'app-all-chats',
  templateUrl: './all-chats.component.html',
  styleUrls: ['./all-chats.component.css']
})
export class AllChatsComponent {
  @Input() chatList!: userModel;
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
