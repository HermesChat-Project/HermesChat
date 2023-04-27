import { Injectable } from '@angular/core';
import { userModel } from '../../../model/user.model';
import { chatList } from '../../../model/chat-list.model';
import { callsModel } from '../../../model/calls.model';
import { messageModel } from '../../../model/message.model';
import { DataStorageService } from '../shared/data-storage.service';
import { FriendModel } from 'model/friendModel';
import { CalendarModel } from 'model/calendar.model';

@Injectable({
  providedIn: 'root'
})
export class ChatSelectorService {
  PersonalListSearch: chatList[] = [];
  chatList: userModel[] = [
    new userModel(0, 'Username', 'email', 'password', [
      new chatList(0, 0, 'Prova', "ok", "img", [
        new messageModel(0, 0, 'Username', 'ok', new Date(2022, 8, 12)),
        new messageModel(1, 0, 'Username', 'ok', new Date(2022, 8, 12)),
        new messageModel(2, 1, 'Pippo', 'Bene', new Date(2022, 8, 12)),
        new messageModel(3, 1, 'Pippo', 'Ciao', new Date(2022, 8, 15)),
        new messageModel(4, 0, 'Username', 'ok', new Date(2022, 8, 16)),
      ], false, ["Username", "Prova"]),
      new chatList(1, 15, 'Gruppo 1', "ok", "img", [
        new messageModel(0, 0, 'Username', 'ok', new Date(2022, 8, 12)),
        new messageModel(1, 0, 'Username', 'ok', new Date(2021, 8, 13)),
        new messageModel(2, 1, 'Pippo', 'Bene', new Date(2021, 8, 14)),
        new messageModel(3, 2, 'Pluto', 'Ciao', new Date(2021, 8, 15)),
        new messageModel(4, 0, 'Username', 'Prova messaggi', new Date(2022, 11, 31)),
      ], true, [""]),
      new chatList(2, 16, 'Gruppo 2', "ok", "img", [
        new messageModel(0, 1, 'Pippo', 'ok', new Date(2023, 1, 13)),
        new messageModel(1, 2, 'Pluto', 'ok', new Date(2023, 3, 13)),
        new messageModel(2, 3, 'Paperino', 'Bene', new Date(2023, 4, 14)),
        new messageModel(3, 2, 'Pluto', 'Ciao', new Date(2023, 5, 15)),
        new messageModel(4, 3, 'Paperino', 'ok', new Date()),
        new messageModel(5, 3, 'Paperino', 'ok', new Date()),
        new messageModel(6, 3, 'Paperino', 'ok', new Date()),
        new messageModel(7, 3, 'Paperino', 'ok', new Date()),
        new messageModel(8, 3, 'Paperino', 'ok', new Date()),
        new messageModel(9, 3, 'Paperino', 'ok', new Date()),
        new messageModel(10, 3, 'Paperino', 'ok', new Date()),

      ], true, [""]),
      new chatList(3, 17, 'Gruppo 3', "ok", "img", [
        new messageModel(0, 1, 'Pippo', 'ok', new Date(2023, 1, 13)),
        new messageModel(1, 2, 'Pluto', 'ok', new Date(2023, 2, 13)),
        new messageModel(2, 3, 'Paperino', 'Bene', new Date(2023, 2, 14)),
        new messageModel(3, 2, 'Pluto', 'Ciao', new Date(2023, 2, 15)),
        new messageModel(4, 3, 'Paperino', 'ok', new Date(2011, 2, 15, 12, 30, 0)),
      ], true, [""]),
      new chatList(4, 18, 'Gruppo 4', "ok", "img", [
        new messageModel(0, 1, 'Pippo', 'ok', new Date(2023, 1, 13)),
        new messageModel(1, 2, 'Pluto', 'ok', new Date(2023, 2, 13)),
        new messageModel(2, 3, 'Paperino', 'Bene', new Date(2023, 2, 14)),
        new messageModel(3, 2, 'Pluto', 'Ciao', new Date(2023, 2, 15)),
        new messageModel(4, 3, 'Paperino', 'ok', new Date()),
      ], true, [""]),
      new chatList(5, 19, 'Gruppo 5', "ok", "img", [
        new messageModel(0, 1, 'Pippo', 'ok', new Date(2023, 2, 13)),
        new messageModel(1, 2, 'Pluto', 'ok', new Date(2023, 2, 13)),
        new messageModel(2, 3, 'Paperino', 'Bene', new Date(2023, 2, 14)),
        new messageModel(3, 2, 'Pluto', 'Ciao', new Date(2023, 2, 15)),
        new messageModel(4, 3, 'Paperino', 'Angular', new Date()),
      ], true, [""]),
      new chatList(6, 20, 'Gruppo 6', "ok", "img", [
        new messageModel(0, 1, 'Pippo', 'ok', new Date(2023, 1, 13)),
        new messageModel(1, 2, 'Pluto', 'ok', new Date(2023, 2, 13)),
        new messageModel(2, 3, 'Paperino', 'Bene', new Date(2023, 2, 14)),
        new messageModel(3, 2, 'Pluto', 'Ciao', new Date(2023, 2, 15)),
        new messageModel(4, 3, 'Paperino', 'Mongo db', new Date()),
      ], true, [""]),
      new chatList(7, 21, 'Gruppo 7', "ok", "img", [
        new messageModel(0, 1, 'Pippo', 'ok', new Date(2023, 1, 13)),
        new messageModel(1, 2, 'Pluto', 'ok', new Date(2023, 2, 13)),
        new messageModel(2, 3, 'Paperino', 'Bene', new Date(2023, 2, 14)),
        new messageModel(3, 2, 'Pluto', 'Ciao', new Date(2023, 2, 15)),
        new messageModel(4, 3, 'Paperino', 'DOTNET CORE', new Date())
      ], true, [""]),
      new chatList(6, 22, 'Gruppo 8', "ok", "img", [
        new messageModel(0, 1, 'Pippo', 'ok', new Date(2023, 1, 13)),
        new messageModel(1, 2, 'Pluto', 'ok', new Date(2023, 2, 13)),
        new messageModel(2, 3, 'Paperino', 'Bene', new Date(2023, 2, 14)),
        new messageModel(3, 2, 'Pluto', 'Ciao', new Date(2023, 2, 15)),
        new messageModel(4, 3, 'Paperino', 'SQL', new Date())
      ], true, [""]),
      new chatList(9, 23, 'Gruppo 9', "ok", "img", [
        new messageModel(0, 1, 'Pippo', 'Ciao', new Date(2023, 1, 13)),
      ], true, [""]),
      new chatList(10, 24, 'PC', "ok", "img", [
        new messageModel(0, 1, 'Pippo', 'ok', new Date()),
      ], true, [""]),
    ], [new FriendModel(1, "Pippo", "Pippo", "Pippo"),
    new FriendModel(2, "Pluto", "Pluto", "Pluto"),
    new FriendModel(3, "Paperino", "Paperino", "Paperino"),
    new FriendModel(4, "Paperone", "Paperone", "Paperone"),
    new FriendModel(5, "Paperoga", "Paperoga", "Paperoga"),
    ],
      [
        new callsModel(0, 0, 0, new Date(), 0),
        new callsModel(1, 0, 2, new Date(), 1),
        new callsModel(2, 0, 3, new Date(), 2),
        new callsModel(3, 0, 4, new Date(), 0),
        new callsModel(4, 0, 5, new Date(), 2),
        new callsModel(5, 0, 6, new Date(), 2),
        new callsModel(6, 0, 7, new Date(), 1),
        new callsModel(7, 0, 8, new Date(), 1),
        new callsModel(8, 0, 9, new Date(), 0),
        new callsModel(9, 0, 9, new Date(), 0)]),
    new userModel(1, 'Pippo', 'pippo@gmail.com', 'pippo', [], [
      new FriendModel(2, "Pluto", "Pluto", "Pluto"),
      new FriendModel(3, "Paperino", "Paperino", "Paperino"),
      new FriendModel(0, "Username", "Prova", "Prova2")
    ]),
    new userModel(2, 'Pluto', 'pluto@gmail.com', 'pluto', [], [
      new FriendModel(1, "Pippo", "Pippo", "Pippo"),
      new FriendModel(3, "Paperino", "Paperino", "Paperino"),
      new FriendModel(0, "Username", "Prova", "Prova2"),
      new FriendModel(5, "Paperoga", "Paperoga", "Paperoga")
    ]),
    new userModel(3, 'Paperino', 'paperino@gmail.com', 'paperino', [], [
      new FriendModel(1, "Pippo", "Pippo", "Pippo"),
      new FriendModel(2, "Pluto", "Pluto", "Pluto"),
      new FriendModel(0, "Username", "Prova", "Prova2")
    ]),
    new userModel(4, 'Paperone', 'paperone@gmail.com', 'paperone', [], [
      new FriendModel(1, "Pippo", "Pippo", "Pippo"),
      new FriendModel(2, "Pluto", "Pluto", "Pluto"),
      new FriendModel(5, "Paperoga", "Paperoga", "Paperoga"),
      new FriendModel(6, "Paperina", "Paperina", "Paperina")
    ]),
    new userModel(5, 'Paperoga', 'paperoga@gmail.com', 'paperoga', [], [
      new FriendModel(1, "Pippo", "Pippo", "Pippo"),
      new FriendModel(4, "Paperone", "Paperone", "Paperone"),
      new FriendModel(6, "Paperina", "Paperina", "Paperina")
    ]),
    new userModel(6, 'Paperina', 'paperina@gmail.com', 'paperina', [], [
      new FriendModel(4, "Paperone", "Paperone", "Paperone"),
      new FriendModel(5, "Paperoga", "Paperoga", "Paperoga"),
    ]),
    new userModel(7, 'Qui', 'qui@gmail.com', 'qui', [], [
      new FriendModel(8, "Quo", "Quo", "Quo"),
      new FriendModel(9, "Qua", "Qua", "Qua")
    ]),
    new userModel(8, 'Quo', 'quo@gmail.com', 'quo', [], [
      new FriendModel(7, "Qui", "Qui", "Qui"),
      new FriendModel(9, "Qua", "Qua", "Qua")
    ]),
    new userModel(9, 'Qua', 'qua@gmail.com', 'qua', [], [
      new FriendModel(7, "Qui", "Qui", "Qui"),
      new FriendModel(8, "Quo", "Quo", "Quo")
    ])
  ];

  selectedChat: chatList | null = null;
  calendarSectionClicked: boolean = false;

  userLang = navigator.language || 'en-US';


  src: string = "";
  flagCamera: number = 0; //0: off, 1: photo, 2: video, -1: camera not permitted, -2: camera not available
  stream: MediaStream | null = null;
  constructor(private dataStorage: DataStorageService) { }





  //#region calendar

  calendarExample: CalendarModel[] = [
    new CalendarModel(1, 'Birthday aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', new Date(2023, 2, 18, 12, 5), true, 'My birthday aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'),
    new CalendarModel(2, 'Meeting', new Date(2023, 2, 18, 11, 3), false, 'Meeting with the team'),
    new CalendarModel(3, 'Remember', new Date(2023, 2, 18, 11, 23), true, 'Remember to buy the milk aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'),
    new CalendarModel(4, 'Meeting', new Date(2023, 2, 21, 11, 56), false, 'Meeting with the team aaaaaaaaaaaaaaaaaaaaaaaaaaaa'),
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
    new CalendarModel(24, 'Meeting', new Date(2023, 3, 18, 20, 3), true, 'Meeting with the team'),
    new CalendarModel(25, 'Meeting', new Date(2023, 3, 30, 21, 3), true, 'Meeting with the team', "#777777", false, "00:00"),

  ]
  /*variables for the calendar modal*/
  triggerCalendarModal: boolean = false;
  selectedCalendarEvent: CalendarModel | null = null;
  selectedNotifyTime: string = "00:00";
  /************************************/
  isPersonalEvent = true;
  weekDays: string[] = this.getDaysBasedOnLang(this.userLang);
  months: string[] = this.getMonthsBasedOnLang(this.userLang);
  selectedDate: string = new Date().getFullYear() + '-' + (this.returnMonth(new Date())) + '-' + this.returnDay(new Date());

  selectedMonth: number = new Date().getMonth();
  selectedYear: number = new Date().getFullYear();

  EventsPerMonth: { [key: string]: CalendarModel[] } = {};

  firstDayOfMonth: number = this.getFirstDayOfMonth(this.selectedYear, this.selectedMonth);
  getDaysBasedOnLang(lang: string) {
    let date = new Date();
    let days: string[] = [];
    let index: number = 0;
    for (let i = 0; i < 7; i++) {
      if (date.getDay() == 1) index = i;
      days.push(date.toLocaleDateString(lang, { weekday: 'short' }));
      date.setDate(date.getDate() + 1);
    }
    //sort them based on the first day of the week
    console.log(index);
    let firstDays = days.splice(0, index);
    days = days.concat(firstDays);
    return days;
  }

  getMonthsBasedOnLang(lang: string) {
    let date = new Date();
    let months: string[] = [];
    let index: number = 0;
    for (let i = 0; i < 12; i++) {
      if (date.getMonth() == 0) index = i;
      months.push(date.toLocaleDateString(lang, { month: 'long' }));
      date.setMonth(date.getMonth() + 1);
    }
    //sort them based on the first month of the year
    let firstMonths = months.splice(0, index);
    months = months.concat(firstMonths);
    return months;
  }

  getFirstDayOfMonth(year: number, month: number) {
    let dateIndex = new Date(year, month, 1).getDay();
    if (dateIndex == 0) dateIndex = 7;
    dateIndex--;
    console.log(dateIndex);
    return dateIndex;
  }




  returnMonth(date: Date, havetoadd: boolean = true) {
    let month = date.getMonth();
    if (havetoadd)
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


  getCalendarEventsByMonth() {
    let month = this.selectedMonth + 1;
    let year = this.selectedYear;
    let events: CalendarModel[] = [];
    this.calendarExample.forEach((event: CalendarModel) => {
      if (event.date.getFullYear() == year && event.date.getMonth() + 1 == month) {
        events.push(event);
      }
    });

    let eventsPerDay: {[key: string]: CalendarModel[]} = {};
    events.forEach((event: CalendarModel) => {
      let day = event.date.getDate();
      if (eventsPerDay[day.toString()]) {
        eventsPerDay[day.toString()].push(event);
      } else {
        eventsPerDay[day.toString()] = [event];
      }
    });
    console.log(eventsPerDay);
    return eventsPerDay;
  }

  //#endregion

  //#region  Chat
  bottomScroll() {
    let chat = document.getElementById('listMessage');
    console.log(chat);
    if (chat) {
      chat.scrollTop = chat.scrollHeight - chat.clientHeight;
      // console.log(chat.scrollTop);
    }
  }


  getMaxIndex(chat: chatList) {
    let max = 0;
    chat.messages.forEach((message) => {
      if (message._id > max) {
        max = message._id;
      }
    });
    return max;
  }

  sortChats() {
    this.chatList[0].chatList.sort((a, b) => {
      let aDate = new Date(a.messages[a.messages.length - 1].sentAt);
      let bDate = new Date(b.messages[b.messages.length - 1].sentAt);
      return bDate.getTime() - aDate.getTime();
    });
    this.PersonalListSearch = this.chatList[0].chatList;
  }

  sendMessage(message: string) {
    if (this.selectedChat) {
      let i = this.getMaxIndex(this.selectedChat)
      this.selectedChat.messages.push(new messageModel(i + 1, 0, 'Username', message, new Date()));
      setTimeout(() => {
        this.bottomScroll();
      }, 0);//to improve
    }
  }

  //#endregion

  //#region server calls
  token: string = '';

  getFriends(options: any) {
    // this.dataStorage.PostRequestWithHeaders(`getFriends`, {"Cookie" : localStorage.getItem("Authorization")}, options).subscribe(
    //   (response: any) => {
    //     console.log(response);
    //     // this.router.navigate(['/chat']);
    //   },
    //   (error: Error) => {
    //     console.log(error);

    //   }
    // );
  }

  //#endregion
}
