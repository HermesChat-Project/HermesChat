import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CalendarModel } from 'model/calendar.model';
import { AnimationOptions } from 'ngx-lottie';


@Component({
  selector: 'app-share-calendar',
  templateUrl: './share-calendar.component.html',
  styleUrls: ['./share-calendar.component.css']
})
export class ShareCalendarComponent {
  @Input() calendar!: CalendarModel;
  @Output() checkCalendarEvent = new EventEmitter<{calendar: CalendarModel, check: boolean}>();

  options: AnimationOptions = {
    path: '../../../assets/animation/check.json',
    loop: false,

  }

  check: boolean = false;

  checkCalendar() {
    this.check = !this.check;
    this.checkCalendarEvent.emit({calendar: this.calendar, check: this.check});
  }
}
