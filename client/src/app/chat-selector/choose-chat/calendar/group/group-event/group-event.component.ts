import { Component, Input, Output, AfterContentInit, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import { CalendarModel } from 'model/calendar.model';

@Component({
  selector: 'app-group-event',
  templateUrl: './group-event.component.html',
  styleUrls: ['./group-event.component.css']
})
export class GroupEventComponent implements AfterContentInit{
  @Input() type_of_event!: CalendarModel;
  @Output() expandEvent: EventEmitter<boolean> = new EventEmitter<boolean>();
  @ViewChild("desc", { static: true }) div_desc!: ElementRef;

  expand: boolean = false;
  message: string = 'Mostra di più';
  divDesc!: ElementRef;
  getHoursAndMinutes(date: Date) {
    let hours = date.getHours().toString();
    let minutes = date.getMinutes().toString();
    if (hours.length < 2) {
      hours = '0' + hours;
    }
    if (minutes.length < 2) {
      minutes = '0' + minutes;
    }
    return hours + ':' + minutes;
  }

  ngAfterContentInit() {
    this.divDesc = this.div_desc;
  }

  longText() {

    //console.log(text);
    //console.log( this.divDesc.nativeElement.offsetWidth);
    return this.divDesc.nativeElement.scrollWidth > this.divDesc.nativeElement.offsetWidth || this.expand;
  }

  showMore() {
    this.expand = !this.expand;
    this.expandEvent.emit(this.expand);
    this.message = this.expand ? 'Mostra di meno' : 'Mostra di più';
    //return text.substring(0, 100) + '...';
  }
}
