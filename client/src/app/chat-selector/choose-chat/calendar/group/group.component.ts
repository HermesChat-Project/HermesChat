import { Component, Input } from '@angular/core';
import { CalendarModel } from 'model/calendar.model';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css']
})
export class GroupComponent {
  @Input() group!: CalendarModel[];

  show: string = 'Mostra di più';
  expand: boolean = false;

  getHoursAndMinutes(date: Date) {
    let hours = date.getHours().toString();
    let minutes = date.getMinutes().toString();
    if (hours.length < 2) {
      hours = '0' + hours;
    }
    if (minutes.length < 2 ) {
      minutes = '0' + minutes;
    }
    return hours + ':' + minutes;
  }

  longText(text: string) {
    if (text.length > 100) {
      return true;
    }
    return false;
  }

  showMore(text: string) {
    this.expand = !this.expand;
    this.show = this.expand ? 'Mostra di meno' : 'Mostra di più';
    //return text.substring(0, 100) + '...';
  }
}
