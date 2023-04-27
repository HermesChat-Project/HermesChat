import { Component, ElementRef, ViewChild, Inject } from '@angular/core';
import { ChatSelectorService } from '../../chat.service';
import { CalendarModel } from 'model/calendar.model';
import { ConstantPool } from '@angular/compiler';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatSelectChange } from '@angular/material/select';


@Component({
  selector: 'app-full-calendar',
  templateUrl: './full-calendar.component.html',
  styleUrls: ['./full-calendar.component.css'],

})

export class FullCalendarComponent {
  @ViewChild("date") date!: ElementRef;
  @ViewChild("time") time!: ElementRef;
  @ViewChild("description") description!: ElementRef;
  @ViewChild("title") title!: ElementRef;

  @ViewChild("datepicker") datepicker!: ElementRef;
  constructor(public chatSelector: ChatSelectorService, private _adapter: DateAdapter<any>, @Inject(MAT_DATE_LOCALE) private _locale: string) { }
  rows = new Array(5);

  isOnModifyingMode: boolean = false;
  isOnCreatingMode: boolean = false;
  modifyingEvent: CalendarModel | null = null;
  selDate: string = "";
  confirmExit: boolean = false;

  readonly_disabled() {
    return !this.isOnModifyingMode && !this.isOnCreatingMode;
  }

  ngOnInit() {
    this._locale = this.chatSelector.userLang
    this._adapter.setLocale(this._locale);
  }

  today = new Date();

  notifyTime: { time: string, val: string }[] = [
    { time: "Non notificare", val: "00:00" },
    { time: "5 minuti prima", val: "00:05" },
    { time: "10 minuti prima", val: "00:10" },
    { time: "15 minuti prima", val: "00:15" },
    { time: "30 minuti prima", val: "00:30" },
    { time: "1 ora prima", val: "01:00" },
    { time: "2 ore prima", val: "02:00" },
  ]

  input: Date = new Date();
  clickedDate: Date = new Date();

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

    if ((event.target as HTMLElement).tagName == "P" || (event.target as HTMLElement).tagName == "SPAN") {
      (event.target as HTMLElement).parentElement?.firstChild?.textContent == "[P]" ? this.chatSelector.isPersonalEvent = true : this.chatSelector.isPersonalEvent = false;
    }
    else {
      if ((event.target as HTMLElement).classList.contains("calendar_day_events"))
        (event.target as HTMLElement).firstChild?.textContent == "[P]" ? this.chatSelector.isPersonalEvent = true : this.chatSelector.isPersonalEvent = false;
    }


  }

  createEvent(event: MouseEvent, rows: number, cols: number) {
    let elClicked = event.target as HTMLElement;
    this.confirmExit = false;
    console.log(elClicked.tagName);
    if (elClicked.tagName == "P" || elClicked.tagName == "SPAN") {
      event.stopPropagation();
    }
    else {
      this.today = new Date();
      this.clickedDate = new Date(this.chatSelector.selectedYear, this.chatSelector.selectedMonth, parseInt(this.chatSelector.selectedDate.split("-")[2]));
      if (this.clickedDate >= new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate())) {
        this.chatSelector.triggerCalendarModal = true;
        this.isOnCreatingMode = true;
        this.modifyingEvent = new CalendarModel(-1, "", new Date(this.clickedDate.setHours(this.today.getHours(), this.today.getMinutes())), true, "");
      }
    }
  }
  seeEvent(sel_event: CalendarModel) {
    this.chatSelector.triggerCalendarModal = true;
    this.chatSelector.selectedCalendarEvent = sel_event;
    this.modifyingEvent = { ...sel_event };
    console.log(this.modifyingEvent);
    this.chatSelector.selectedNotifyTime = sel_event.notifyTime;
  }

  checkIfIsPersonalOrShared(event: CalendarModel) {
    if (event.isPersonal)
      return "[P]";
    else
      return "[S]";
  }

  checkIfThereAreManyEvents(row: number, col: number) {
    let eventPerDate = this.chatSelector.EventsPerMonth[this.getThisDate(row, col)];
    if (eventPerDate) {
      if (eventPerDate.length > 3)
        return true;
      else
        return false;
    }
    return false;
  }
  close(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains("cal_modal")) {
      if (!this.isOnModifyingMode && !this.isOnCreatingMode) {
        this.chatSelector.triggerCalendarModal = false;
        this.isOnModifyingMode = false;
      }
      else if (this.isOnCreatingMode && !this.confirmExit) {
        if (confirm("Sei sicuro di voler uscire? I dati inseriti andranno persi")) {
          this.chatSelector.triggerCalendarModal = false;
          this.isOnCreatingMode = false;
        }
      }
    }
  }
  closeModal() {
    if (!this.isOnModifyingMode && !this.isOnCreatingMode) {
      this.chatSelector.triggerCalendarModal = false;
      this.isOnModifyingMode = false;
    }
    else if (this.isOnCreatingMode) {
      if (confirm("Sei sicuro di voler uscire? I dati inseriti andranno persi")) {
        this.chatSelector.triggerCalendarModal = false;
        this.isOnCreatingMode = false;
      }

      this.confirmExit = true;
    }
  }

  modifyingOrCreation() {
    if (this.isOnCreatingMode)
      return "Crea";
    return "Modifica";
  }

  deleteEvent() {
    this.chatSelector.calendarExample.splice(this.chatSelector.calendarExample.indexOf(this.chatSelector.selectedCalendarEvent!), 1);
    this.chatSelector.EventsPerMonth = this.chatSelector.getCalendarEventsByMonth();
    this.chatSelector.triggerCalendarModal = false;
  }

  changeDate(event: MatDatepickerInputEvent<any, any>) {
    let aus_hr = this.modifyingEvent!.date!.getHours();
    let aus_min = this.modifyingEvent!.date!.getMinutes();
    let date = new Date(event.value);
    date.setHours(aus_hr, aus_min);

    this.modifyingEvent!.date = date;

  }

  exitModifyingMode(event: MouseEvent) {
    let el = event.target as HTMLElement;
    el = el.nextElementSibling as HTMLElement;
    el.innerHTML = "Modifica";
    this.isOnModifyingMode = false;
    this.modifyingEvent = { ...this.chatSelector.selectedCalendarEvent! };
    this.chatSelector.selectedNotifyTime = this.notifyTime.find(x => x.val == this.modifyingEvent!.notifyTime)?.val!;
  }

  checkIfThaEventCanBeModified() {
    if ((this.chatSelector.selectedCalendarEvent?.date! >= (new Date())) || this.isOnCreatingMode)
      return true;
    else
      return false;
  }

  changeTime(event: any) {
    this.modifyingEvent!.date = new Date(this.modifyingEvent!.date!.getFullYear(), this.modifyingEvent!.date!.getMonth(), this.modifyingEvent!.date!.getDate(), event.target.value.split(":")[0], event.target.value.split(":")[1]);
  }

  chengeDesc(event: any) {
    this.modifyingEvent!.description = event.target.value;
  }

  changeCol(event: any) {
    this.modifyingEvent!.color = event.target.value;
  }

  changeTitle(event: any) {
    this.modifyingEvent!.title = event.target.value;
  }




  modifyEvent(event: MouseEvent) {
    let el = event.target as HTMLElement;
    if (!this.isOnCreatingMode) {
      if (el.classList.contains("btn-success")) {
        this.isOnModifyingMode = false;
        el.innerHTML = "Modifica";
        this.chatSelector.calendarExample[this.chatSelector.calendarExample.indexOf(this.chatSelector.selectedCalendarEvent!)] = this.modifyingEvent!;
        this.chatSelector.EventsPerMonth = this.chatSelector.getCalendarEventsByMonth();
        this.chatSelector.triggerCalendarModal = false;
      }
      else {
        el.innerHTML = "Salva"
        this.isOnModifyingMode = true;
      }
    }
    else {
      this.chatSelector.calendarExample.push(this.modifyingEvent!);
      this.chatSelector.EventsPerMonth = this.chatSelector.getCalendarEventsByMonth();
      this.chatSelector.triggerCalendarModal = false;
      this.isOnCreatingMode = false;
    }
  }

  returnMinutes(min: number | undefined) {
    if (min! < 10)
      return "0" + min!.toString();
    return min;
  }

}
