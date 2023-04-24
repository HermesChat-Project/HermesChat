import { Component, EventEmitter, Input, Output, ViewChild, ElementRef, AfterContentInit } from '@angular/core';
import { CalendarModel } from 'model/calendar.model';
import { ChatSelectorService } from 'src/app/chat/chat.service';

@Component({
  selector: 'app-personal-event',
  templateUrl: './personal-event.component.html',
  styleUrls: ['./personal-event.component.css']
})
export class PersonalEventComponent implements AfterContentInit {
  @Input() type_of_event!: CalendarModel;
  @Output() expandEvent: EventEmitter<boolean> = new EventEmitter<boolean>();
  @ViewChild("desc", { static: true }) div_desc!: ElementRef;

  constructor(public chatSelector: ChatSelectorService) {}

  expand: boolean = false;
  isShow: boolean = false;
  message: string = 'Mostra di più';
  divDesc!: ElementRef;

  ngAfterContentInit() {
    this.divDesc = this.div_desc;
  }

  longText() {
    //console.log(this.divDesc.nativeElement.offsetWidth, this.divDesc.nativeElement.scrollWidth);
    return this.divDesc.nativeElement.scrollWidth > this.divDesc.nativeElement.offsetWidth || this.expand;
  }

  showMore() {
    this.expand = !this.expand;
    this.expandEvent.emit(this.expand);
    this.message = this.expand ? 'Mostra di meno' : 'Mostra di più';
    //return text.substring(0, 100) + '...';
  }
}
