import { Component } from '@angular/core';
import { ChatSelectorService } from '../../chat.service';
import { CalendarModel } from 'model/calendar.model';

@Component({
  selector: 'app-full-calendar',
  templateUrl: './full-calendar.component.html',
  styleUrls: ['./full-calendar.component.css']
})
export class FullCalendarComponent {
  constructor(public chatSelector: ChatSelectorService){}

  monthEvents:CalendarModel[] = [];
  nextMonth(){
    this.chatSelector.selectedMonth++;
    if(this.chatSelector.selectedMonth > 11){
      this.chatSelector.selectedMonth = 0;
      this.chatSelector.selectedYear++;
    }

    this.monthEvents = this.chatSelector.getCalendarEventsByMonth()
  }

  prevMonth(){
    this.chatSelector.selectedMonth--;
    if(this.chatSelector.selectedMonth < 0){
      this.chatSelector.selectedMonth = 11;
      this.chatSelector.selectedYear--;
    }
    this.monthEvents = this.chatSelector.getCalendarEventsByMonth()
  }
}
