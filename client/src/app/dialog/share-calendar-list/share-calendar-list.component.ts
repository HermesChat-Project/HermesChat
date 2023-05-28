import { DialogRef } from '@angular/cdk/dialog';
import { Component } from '@angular/core';
import { CalendarModel } from 'model/calendar.model';
import { ChatSelectorService } from 'src/app/chat/chat.service';


@Component({
  selector: 'app-share-calendar-list',
  templateUrl: './share-calendar-list.component.html',
  styleUrls: ['./share-calendar-list.component.css']
})
export class ShareCalendarListComponent {
  constructor(public chatSelector: ChatSelectorService, private dialog: DialogRef<CalendarModel[]>) { }
  check: boolean = false;
  calendarSharingList: CalendarModel[] = [];
  shareCalendar() {
    if(this.calendarSharingList.length != 0)
      this.dialog.close(this.calendarSharingList);
  }

  checkCalendar(event: { calendar: CalendarModel; check: boolean; }) {
    this.check = event.check;
    if (event.check) {
      this.calendarSharingList.push(event.calendar);
    }
    else {
      this.calendarSharingList.splice(this.calendarSharingList.indexOf(event.calendar), 1);
    }

  }
}
