import { Component, Input } from '@angular/core';
import { CalendarModel } from 'model/calendar.model';

@Component({
  selector: 'app-personal',
  templateUrl: './personal.component.html',
  styleUrls: ['./personal.component.css']
})
export class PersonalComponent {
  @Input() personal!: CalendarModel[] ;
  expand: boolean = false;
  OnExpandEvent(isExpand: boolean){
    this.expand = isExpand;
  }
}
