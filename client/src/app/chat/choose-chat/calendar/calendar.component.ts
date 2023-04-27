import { Component, ElementRef, ViewChild } from '@angular/core';
import { CalendarModel } from 'model/calendar.model';
import { ChatSelectorService } from '../../chat.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent {
  @ViewChild("date") date!: ElementRef;
  @ViewChild("selector") selected!: ElementRef;
  @ViewChild("events") events!: ElementRef;


  constructor(public chatSelector: ChatSelectorService) {}

  width_section = 300;




  changeDate() {
    console.log(this.date.nativeElement.value);
    this.chatSelector.selectedDate = this.date.nativeElement.value;
  }
  changeEvent(type:number, event: Event) {
    this.chatSelector.isPersonalEvent = type == 0;
  }

  PersonalEvents() {
    let filter: CalendarModel[] =  this.chatSelector.calendarExample.filter((event) => {
      // console.log(event.date.getFullYear() + '-' + (this.returnMonth(event.date, false)) + '-' + this.returnDay(event.date), this.selected_day);
      return event.isPersonal && this.chatSelector.selectedDate == event.date.getFullYear() + '-' + (this.chatSelector.returnMonth(event.date)) + '-' + this.chatSelector.returnDay(event.date);
    })
    // sort by hour and minutes
    filter.sort((a, b) => {
      return a.date.getHours() - b.date.getHours() || a.date.getMinutes() - b.date.getMinutes();//order the array bi hour and if the hour is the same order by minutes
    })
    return filter;
  }

  GroupEvents() {
    let filter: CalendarModel[] =  this.chatSelector.calendarExample.filter((event) => {
      return !event.isPersonal && this.chatSelector.selectedDate == event.date.getFullYear() + '-' + (this.chatSelector.returnMonth(event.date)) + '-' + this.chatSelector.returnDay(event.date);
    })
    filter.sort((a, b) => {
      return a.date.getHours() - b.date.getHours() || a.date.getMinutes() - b.date.getMinutes();//order the array bi hour and if the hour is the same order by minutes
    })
    return filter;

  }




}
