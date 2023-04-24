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
  isPersonal = true;
  width_section = 300;




  changeDate() {
    this.chatSelector.selectedDate = this.date.nativeElement.value;
  }



  changeEvent(type:number, event: Event) {
    this.isPersonal = type == 0;
    let target = event.currentTarget as HTMLInputElement;
    //animation options
    let options: object = {
      duration: 200,
      iterations: 1,
      fill: 'forwards',
      easing: 'ease-in-out'
    }
    // animation for the div selector
    let KeyFrame: Keyframe[]= [
      {left: this.selected.nativeElement.offsetLeft + 'px'},
      {left: target.offsetLeft + 'px'}
    ]

    this.selected.nativeElement.animate(KeyFrame, options);

    // animation for the div events
    let KeyFrame2: Keyframe[]= [
      {left : this.events.nativeElement.offsetLeft + 'px'},
      {left : -type * 100 + '%'}
    ]

    this.events.nativeElement.animate(KeyFrame2, options);
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
