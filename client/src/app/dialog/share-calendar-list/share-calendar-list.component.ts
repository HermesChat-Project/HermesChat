import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CalendarModel } from 'model/calendar.model';
import { ChatSelectorService } from 'src/app/chat/chat.service';

@Component({
  selector: 'app-share-calendar-list',
  templateUrl: './share-calendar-list.component.html',
  styleUrls: ['./share-calendar-list.component.css']
})
export class ShareCalendarListComponent {
  constructor(public chatSelector: ChatSelectorService, @Inject(MAT_DIALOG_DATA) public cal_list: CalendarModel[]) { }
  check: boolean = false;
  calendarSharingList: CalendarModel[] = [];


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
