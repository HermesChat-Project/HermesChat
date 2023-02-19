import { Component, ElementRef, ViewChild } from '@angular/core';
import { CalendarModel } from 'model/calendar.model';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent {
  @ViewChild("date") date!: ElementRef;
  @ViewChild("selector") selected!: ElementRef;
  @ViewChild("events") events!: ElementRef;

  selected_day = new Date().getFullYear() + '-' + (this.returnMonth(new Date())) + '-' + this.returnDay(new Date());
  isPersonal = true;
  width_section = 300;

  calendarExample : CalendarModel[] = [
    new CalendarModel(1, 'Birthday', new Date(2023, 2, 18, 12, 5), true, 'My birthday aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa '),
    new CalendarModel(2, 'Meeting', new Date(2023, 2, 18, 11, 3), false, 'Meeting with the team'),
    new CalendarModel(3, 'Remember', new Date(2023, 2, 18, 11, 23), true, 'Remember to buy the milk aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'),
    new CalendarModel(4, 'Meeting', new Date(2023, 2, 21, 11, 56), false, 'Meeting with the team'),
    new CalendarModel(5, 'Meeting', new Date(2023, 2, 21, 14), false, 'Meeting with the team'),
    new CalendarModel(6, 'Grocery', new Date(2023, 2, 22, 16, 30), true, 'Buy the groceries'),
    new CalendarModel(7, 'Friends', new Date(2023, 2, 22, 12, 34), true, 'Go to the cinema with friends'),
    new CalendarModel(8, 'Meeting', new Date(2023, 2, 23, 17), false, 'Meeting with the team'),
    new CalendarModel(9, 'Dog', new Date(2023, 2, 24, 18), true, 'Take the dog for a walk'),
    new CalendarModel(10, 'Gym', new Date(2023, 2, 25, 10, 23), true, 'Go to the gym'),
    new CalendarModel(11, 'Meeting', new Date(2023, 2, 25, 9, 30), false, 'Meeting with the team'),
    new CalendarModel(12, 'School', new Date(2023, 2, 26, 9), true, 'Go to school'),
    new CalendarModel(13, 'Exam', new Date(2023, 2, 27, 9), true, 'Study for the exam'),
    new CalendarModel(14, 'Grocery', new Date(2023, 2, 28, 7), true, 'Buy the groceries'),
    //meeting with the team alwanys in the same day
    new CalendarModel(15, 'Meeting', new Date(2023, 2, 18, 11, 3), false, 'Meeting with the team'),
    new CalendarModel(16, 'Meeting', new Date(2023, 2, 18, 12, 3), false, 'Meeting with the team'),
    new CalendarModel(17, 'Meeting', new Date(2023, 2, 18, 13, 3), false, 'Meeting with the team'),
    new CalendarModel(18, 'Meeting', new Date(2023, 2, 18, 14, 3), false, 'Meeting with the team'),
    new CalendarModel(19, 'Meeting', new Date(2023, 2, 18, 15, 3), false, 'Meeting with the team'),
    new CalendarModel(20, 'Meeting', new Date(2023, 2, 18, 16, 3), false, 'Meeting with the team'),
    new CalendarModel(21, 'Meeting', new Date(2023, 2, 18, 17, 3), false, 'Meeting with the team'),
    new CalendarModel(22, 'Meeting', new Date(2023, 2, 18, 18, 3), false, 'Meeting with the team'),
    new CalendarModel(23, 'Meeting', new Date(2023, 2, 18, 19, 3), false, 'Meeting with the team'),

  ]

  constructor() { }

  changeDate() {
    this.selected_day = this.date.nativeElement.value;
  }

  returnMonth(date: Date, havetoadd:boolean = true) {
    let month = date.getMonth();
    if(havetoadd)
      month++;
    if (month < 10) {
      return '0' + month;
    }
    return month;
  }

  returnDay(date: Date) {
    let day = date.getDate();
    if (day < 10) {
      return '0' + day;
    }
    return day;
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
    let filter: CalendarModel[] =  this.calendarExample.filter((event) => {
      // console.log(event.date.getFullYear() + '-' + (this.returnMonth(event.date, false)) + '-' + this.returnDay(event.date), this.selected_day);
      return event.isPersonal && this.selected_day == event.date.getFullYear() + '-' + (this.returnMonth(event.date, false)) + '-' + this.returnDay(event.date);
    })
    // sort by hour and minutes
    filter.sort((a, b) => {
      return a.date.getHours() - b.date.getHours() || a.date.getMinutes() - b.date.getMinutes();//order the array bi hour and if the hour is the same order by minutes
    })
    return filter;
  }

  GroupEvents() {
    let filter: CalendarModel[] =  this.calendarExample.filter((event) => {
      return !event.isPersonal && this.selected_day == event.date.getFullYear() + '-' + (this.returnMonth(event.date, false)) + '-' + this.returnDay(event.date);
    })
    filter.sort((a, b) => {
      return a.date.getHours() - b.date.getHours() || a.date.getMinutes() - b.date.getMinutes();//order the array bi hour and if the hour is the same order by minutes
    })
    return filter;

  }




}
