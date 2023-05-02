import { Injectable } from '@angular/core';
import { userModel } from '../../../model/user.model';
import { chatList } from '../../../model/chat-list.model';
import { callsModel } from '../../../model/calls.model';
import { messageModel } from '../../../model/message.model';
import { DataStorageService } from '../shared/data-storage.service';
import { FriendModel } from 'model/friend.model';
import { CalendarModel } from 'model/calendar.model';
import { requestModel } from 'model/request.model';
import { Chat } from 'model/chat.model';

@Injectable({
  providedIn: 'root'
})
export class ChatSelectorService {
  PersonalListSearch: Chat[] = [];
  friendList: FriendModel[] = [];
  friendSerachList: FriendModel[] = [];
  receivedList: requestModel[] = [];
  chatExampleList: Chat[] = [];
  messageList: { [key: string]: messageModel[] } = {};
  infoUser: any
  sentList: { id: string, image: string, nickname: string }[] = [];
  user_action: number = -1; //-1 none, 0: info, 2: privacy, 3: graphics, 4: language, 5: theme, 6: logout

  callList: callsModel[] = [
    new callsModel(0, 1, 2, new Date(), 0),
    new callsModel(1, 1, 2, new Date(), 1),
    new callsModel(2, 2, 1, new Date(), 0),
    new callsModel(3, 2, 3, new Date(), 1),
  ];

  selectedChat: Chat | null = null;
  calendarSectionClicked: boolean = false;

  userLang = navigator.language || 'en-US';


  src: string = "";
  flagCamera: number = 0; //0: off, 1: photo, 2: video, -1: camera not permitted, -2: camera not available
  stream: MediaStream | null = null;
  constructor(private dataStorage: DataStorageService) { }



  //#region friend
  selectedFriend: FriendModel | null = null;

  createChat(friend: FriendModel) {
    let id = friend.id;
    let imgUser = this.infoUser.image;
    let friendImage = friend.image;
    this.createNewChat(id, imgUser, friendImage);
  }
  //#endregion

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

    let eventsPerDay: { [key: string]: CalendarModel[] } = {};
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




  sortChats() {
    this.messageList[this.selectedChat!._id].sort((a, b) => {
      let aDate = new Date(a.dateTime);
      let bDate = new Date(b.dateTime);
      return aDate.getTime() - bDate.getTime();
    });
    this.PersonalListSearch = this.chatExampleList
  }

  sendMessage(message: string, type: string = 'text') {
    if (this.selectedChat) {
      let i = 0
      this.messageList[this.selectedChat._id].push(new messageModel("0", message, new Date().toISOString(), type));
      setTimeout(() => {
        this.bottomScroll();
      }, 0);//to improve


      console.log(this.messageList[this.selectedChat._id]);
    }
  }

  //#endregion

  //#region server calls
  token: string = '';
  getInfo() {
    this.dataStorage.PostRequestWithHeaders(`getInfoUser`, {}, this.getOptionsForRequest()).subscribe({
      next: (response: any) => {
        console.log(response);
        this.infoUser = response.body;
      },
      error: (error: Error) => {
        console.log(error);
      }
    });
  }

  getChats() {
    this.dataStorage.PostRequestWithHeaders(`getChats`, {}, this.getOptionsForRequest()).subscribe({
      next: (response: any) => {
        console.log(response);
        this.chatExampleList = response.body.chats;

      },
      error: (error: Error) => {
        console.log(error);
      }
    });

  }

  getChatMessages(body: any, id: string) {
    this.dataStorage.PostRequestWithHeaders(`getMessages`, body, this.getOptionsForRequest()).subscribe({
      next: (response: any) => {
        console.log(response);
        if (this.messageList[id]) {
          this.messageList[id].push(...response.body.messages.messages);
        }
        else
          this.messageList[id] = response.body.messages.messages;
          console.log(this.messageList);
          this.sortChats();
      },
      error: (error: Error) => {
        console.log(error);
      }
    });

  }

  getFriends() {
    this.dataStorage.PostRequestWithHeaders(`getFriends`, {}, this.getOptionsForRequest()).subscribe({
      next: (response: any) => {
        console.log(response);
        this.friendList = response.body.friends;
        if (this.friendList.length > 0)
          this.friendList = this.friendList.sort((a: FriendModel, b: FriendModel) => { return a.name.localeCompare(b.name) });
        this.friendSerachList = this.friendList;
      },
      error: (error: Error) => {
        console.log(error);

      }
    });
  }

  getReceivedRequests() {
    this.dataStorage.PostRequestWithHeaders(`getFriendRequests`, {}, this.getOptionsForRequest()).subscribe({
      next: (response: any) => {
        console.log(response);
        this.receivedList = response.body.requests;
      },
      error: (error: Error) => {
        console.log(error);

      }
    });
  }

  getSentRequest() {
    this.dataStorage.PostRequestWithHeaders('getRequestSent', {}, this.getOptionsForRequest()).subscribe({
      next: (response: any) => {
        console.log(response);
        this.sentList = response.body.requests;

      },
      error: (error: Error) => {
        console.log(error);
      }
    })
  }

  acceptRequest(body: any) {
    this.dataStorage.PostRequestWithHeaders('acceptFriend', body, this.getOptionsForRequest()).subscribe({
      next: (response: any) => {
        console.log(response);
      },
      error: (error: Error) => {
        console.log(error);

      }
    })
  }

  getOptionsForRequest() {
    return {
      observe: 'response',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Authorization': localStorage.getItem("Authorization")
      },
      withCredentials: true
    };
  }

  createNewChat(id: string, img: string, friendImg: string) {
    let body = {
      "idUser": id,
      "img": img,
      "friendImg": friendImg
    }

    this.dataStorage.PostRequestWithHeaders('createChat', body, this.getOptionsForRequest()).subscribe({
      next: (response: any) => {
        console.log(response);
      },
      error: (error: Error) => {
        console.log(error);
      }
    })
  }



  //#endregion
}
