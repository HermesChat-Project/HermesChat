import { Component } from '@angular/core';
import { ChatSelectorService } from '../../chat.service';
import { CalendarModel } from 'model/calendar.model';

@Component({
  selector: 'app-full-calendar',
  templateUrl: './full-calendar.component.html',
  styleUrls: ['./full-calendar.component.css']
})
export class FullCalendarComponent {
  constructor(public chatSelector: ChatSelectorService) { }
  rows = new Array(5);


  nextMonth() {
    this.chatSelector.selectedMonth++;
    if (this.chatSelector.selectedMonth > 11) {
      this.chatSelector.selectedMonth = 0;
      this.chatSelector.selectedYear++;
    }
    this.changeDateValues();
  }

  prevMonth() {
    this.chatSelector.selectedMonth--;
    if (this.chatSelector.selectedMonth < 0) {
      this.chatSelector.selectedMonth = 11;
      this.chatSelector.selectedYear--;
    }
    this.changeDateValues();
  }

  changeDateValues() {
    this.chatSelector.firstDayOfMonth = this.chatSelector.getFirstDayOfMonth(this.chatSelector.selectedYear, this.chatSelector.selectedMonth);
    this.chatSelector.EventsPerMonth = this.chatSelector.getCalendarEventsByMonth()
  }

  checkFistDayOfMonth(day: number) {
    if (day < this.chatSelector.firstDayOfMonth)
      return { visibility: 'hidden', "border-left": "none" };
    else
      return { visibility: 'visible' };
  }

  checkLastDayOfMonth(index: number, row: number = 4) {
    let date = new Date(this.chatSelector.selectedYear, this.chatSelector.selectedMonth + 1, 0);
    let day = (row * 7) + index - this.chatSelector.firstDayOfMonth + 1;
    if (day > date.getDate())
      return { "display": 'none', "border-left": "none" };
    else
      return { "border-right": "1px solid #e5e5e5" };
  }

  getThisDate(row: number, col: number) {
    let day = (row * 7) + col - this.chatSelector.firstDayOfMonth + 1;
    if (day < 10)
      return "0" + day;
    return day;
  }

  goToDate(row: number, col: number, event: MouseEvent) {
    let day = (row * 7) + col - this.chatSelector.firstDayOfMonth + 1;
    let date = new Date(this.chatSelector.selectedYear, this.chatSelector.selectedMonth, day);
    this.chatSelector.selectedDate = date.getFullYear() + "-" + (this.chatSelector.returnMonth(date, true)) + "-" + this.chatSelector.returnDay(date);

    if((event.target as HTMLElement).tagName == "P" || (event.target as HTMLElement).tagName == "SPAN")
    {
      (event.target as HTMLElement).parentElement?.firstChild?.textContent == "[P]" ? this.chatSelector.isPersonalEvent = true : this.chatSelector.isPersonalEvent = false;
    }
    else
    {
      if((event.target as HTMLElement).classList.contains("calendar_day_events"))
        (event.target as HTMLElement).firstChild?.textContent == "[P]" ? this.chatSelector.isPersonalEvent = true : this.chatSelector.isPersonalEvent = false;
    }


  }

  eventAction(event: MouseEvent) {
    console.log("double click");
  }

  checkIfIsPersonalOrShared(event: CalendarModel) {
    if (event.isPersonal)
      return "[P]";
    else
      return "[S]";
  }

  checkIfThereAreManyEvents(row: number, col: number) {
    let eventPerDate = this.chatSelector.EventsPerMonth[this.getThisDate(row, col)];
    if(eventPerDate)
    {
      if(eventPerDate.length > 3)
        return true;
      else
        return false;
    }
    return false;
  }

}
