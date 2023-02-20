import { Component, Input } from '@angular/core';
import { CalendarModel } from 'model/calendar.model';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css']
})
export class GroupComponent {
  @Input() group!: CalendarModel[];

  @Input() personal!: CalendarModel[] ;
  expand: boolean = false;
  OnExpandEvent(isExpand: boolean){
    this.expand = isExpand;
  }


}
