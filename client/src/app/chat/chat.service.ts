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
import { webSocket } from 'rxjs/webSocket'
import { Conditional } from '@angular/compiler';
import { MatDialog } from '@angular/material/dialog';
import { SurveyComponent } from '../dialog/survey/survey.component';
import { ChartComponent } from '../dialog/chart/chart.component';
import { HttpErrorResponse } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class ChatSelectorService {
  progress: number = 0;
  PersonalListSearch: Chat[] = [];
  friendList: FriendModel[] = [];
  friendSerachList: FriendModel[] = [];
  receivedList: requestModel[] = [];
  chatExampleList: Chat[] = [];
  messageList: { [key: string]: messageModel[] } = {};
  socketMessageList: { [key: string]: messageModel[] } = {};
  infoUser: any
  sentList: { id: string, image: string, nickname: string }[] = [];
  user_action: number = -1; //-1 none, 0: info, 2: privacy, 3: graphics, 4: language, 5: theme, 6: logout
  offsetChat: number = 1

  theme:string = "light";

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
  constructor(private dataStorage: DataStorageService, private dialog:MatDialog) { }



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
  calendarList: CalendarModel[] = []

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
    this.calendarList.forEach((event: CalendarModel) => {
      if (event.date.getFullYear() == year && event.date.getMonth() + 1 == month) {
        events.push(event);
      }
    });

    let eventsPerDay: { [key: string]: CalendarModel[] } = {};
    events.forEach((event: CalendarModel) => {
      let day = event.date.getDate().toString();
      if(day.length < 2)
        day = '0' + day;
      if (eventsPerDay[day]) {
        eventsPerDay[day].push(event);
      } else {
        eventsPerDay[day] = [event];
      }
    });
    console.log(eventsPerDay);
    return eventsPerDay;
  }

  //#endregion

  //#region toggle dialogs
  openDeleteMessgeDialog() {

  }
  openSurveyDialog() {
    this.dialog.open(SurveyComponent, {
      panelClass: 'custom-dialog-container',
      width: '40%',
      minHeight: '50%',
      maxHeight: '70%',
    }).afterClosed().subscribe((result: boolean) => { if (result) { this.sendMessage("Ciao", "survey") } })
  }

  openChartDialog() {
    this.dialog.open(ChartComponent, {
      panelClass: 'custom-dialog-container'
    }).afterClosed().subscribe((result: boolean) => { if (result) { this.sendMessage("Ciao", "chart") } })
  }



  //#endregion

  //#region  Chat
  bottomScroll(to: number = 0) {
    let chat = document.getElementById('listMessage');
    if (chat) {
      if (to != -1)
        chat.scrollTop = chat.scrollHeight - chat.clientHeight;
      else
        chat.scrollTop = chat.scrollHeight / (this.offsetChat - 1);
    }
  }




  sortChats(list: messageModel[] | null = null) {
    if (!list) {
      this.messageList[this.selectedChat!._id].sort((a, b) => {
        let aDate = new Date(a.messages.dateTime);
        let bDate = new Date(b.messages.dateTime);
        return aDate.getTime() - bDate.getTime();
      });
    }
    else {
      list.sort((a: messageModel, b: messageModel) => {
        let aDate = new Date(a.messages.dateTime);
        let bDate = new Date(b.messages.dateTime);
        return aDate.getTime() - bDate.getTime();
      });
    }
  }

  sendMessage(message: string, type: string = 'text', options: any = null) {
    if (this.selectedChat) {
      let i = 0
      this.messageList[this.selectedChat._id].push(new messageModel({ content: message, dateTime: new Date().toISOString(), idUser: this.infoUser._id, type: type }));
      this.socket?.send(JSON.stringify({ "type": "MSG", "idDest": this.selectedChat._id, "payload": message, "flagGroup": this.selectedChat.flagGroup }))
      setTimeout(() => {
        this.bottomScroll();
      }, 0);//to improve

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
        this.progress++;
        this.waitProgress();
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
        if(error.status == 401)
          this.logout();
      }
    });
  }

  getChats() {
    this.dataStorage.PostRequestWithHeaders(`getChats`, {}, this.getOptionsForRequest()).subscribe({
      next: (response: any) => {
        console.log(response);
        this.chatExampleList = response.body.chats;
        this.changeName(response.body.chats);
        for (const chat of this.chatExampleList) {
          if (this.messageList[chat._id] == undefined)
            this.messageList[chat._id] = [];
          if (this.socketMessageList[chat._id] == undefined)
            this.socketMessageList[chat._id] = [];
          this.progress++;
          this.waitProgress();
        }
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
        if(error.status == 401)
          this.logout();
      }
    });

  }

  getChatMessages(body: any, id: string, newMsg: boolean = false) {
    if ((!this.messageList[id] || this.messageList[id].length == 0) || newMsg) {
      this.dataStorage.PostRequestWithHeaders(`getMessages`, body, this.getOptionsForRequest()).subscribe({
        next: (response: any) => {
          console.log(response);
          if (response.body.messages) {
            if (this.messageList[id]) {
              console.log("concat");
              this.sortChats(response.body.messages)
              let array = response.body.messages.concat(this.messageList[id]);
              this.messageList[id] = array;
            }
            else {
              this.messageList[id] = response.body.messages;
              this.sortChats();
            }

            this.messageFeature(newMsg, id);
          }
        },
        error: (error: HttpErrorResponse) => {
          console.log(error);
          if(error.status == 401)
            this.logout();
        }
      });
    }
    else {
      this.messageFeature(newMsg, id);
    }

  }

  getFriends() {
    this.dataStorage.PostRequestWithHeaders(`getFriends`, {}, this.getOptionsForRequest()).subscribe({
      next: (response: any) => {
        console.log(response);
        this.friendList = response.body.friends;
        if (this.friendList.length > 0)
          this.friendList = this.friendList.sort((a: FriendModel, b: FriendModel) => { return a.name.localeCompare(b.name) });
        this.friendSerachList = this.friendList;
        this.progress++;
        this.waitProgress();
        this.getChats();
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
        if(error.status == 401)
          this.logout();
      }
    });
  }

  getReceivedRequests() {
    this.dataStorage.PostRequestWithHeaders(`getFriendRequests`, {}, this.getOptionsForRequest()).subscribe({
      next: (response: any) => {
        console.log(response);
        this.receivedList = response.body.requests;
        this.progress++;
        this.waitProgress();
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
        if(error.status == 401)
          this.logout();
      }
    });
  }

  getSentRequest() {
    this.dataStorage.PostRequestWithHeaders('getRequestSent', {}, this.getOptionsForRequest()).subscribe({
      next: (response: any) => {
        console.log(response);
        this.sentList = response.body.requests;
        this.progress++;
        this.waitProgress();
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
        if(error.status == 401)
          this.logout();
      }
    })
  }

  acceptRequest(body: any) {
    this.dataStorage.PostRequestWithHeaders('acceptFriend', body, this.getOptionsForRequest()).subscribe({
      next: (response: any) => {
        console.log(response);
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
        if(error.status == 401)
          this.logout();
      }
    })
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
      error: (error: HttpErrorResponse) => {
        console.log(error);
        if(error.status == 401)
          this.logout();
      }
    })
  }
  getCalendarEvents() {
    this.dataStorage.PostRequestWithHeaders('getCalendarEvents', {}, this.getOptionsForRequest()).subscribe({
      next: (response: any) => {
        console.log(response);
        this.calendarList = response.body.events;
        this.calendarList.forEach((event: CalendarModel) => {
          event.date = new Date(event.dateTime);
        })
        this.EventsPerMonth = this.getCalendarEventsByMonth();
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
        if(error.status == 401)
          this.logout();
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


  logout() {

  }





  //#endregion

  //#region socket

  socket: WebSocket | null = null;
  startSocket() {
    this.socket = new WebSocket('wss://192.168.1.43:8080/socket');
    this.socket.addEventListener("open", () => {
      console.log("socket open");
      this.progress++;
      this.waitProgress();
    });
    this.socket.addEventListener("message", (event) => {
      let data = JSON.parse(event.data);
      console.log(data);
      if (data.type == "MSG") {
        if (this.selectedChat?._id == data.idDest) {
          this.messageList[data.idDest].push(new messageModel({ content: data.payload, dateTime: new Date().toISOString(), idUser: data.index, type: 'text' }));
          setTimeout(() => {
            this.bottomScroll(-1);
          }, 0);//to improve
        }
        else {
          this.socketMessageList[data.idDest].push(new messageModel({ content: data.payload, dateTime: new Date().toISOString(), idUser: data.index, type: 'text' }));
        }
      }
    })
    this.socket.addEventListener("close", () => {
      console.log("socket close");
    })
  }
  //#endregion

  //#region funcion


  //header
  closeInfo() {
    this.user_action = -1;
  }

  changeTheme(theme: string) {
    this.theme = theme;
    localStorage.setItem('theme', theme);
  }
  //progress bar
  seeMain: boolean = false;
  waitProgress() {

    if (this.progress == 5) {
      setTimeout(() => {
        this.seeMain = true;
      }, 200);
    }
  }


  //chat
  changeName(chatList: any[]) {

    for (const [index, chat] of chatList.entries()) {
      if (chat.flagGroup) {
        this.chatExampleList[index].name = chat.groupName;
        this.chatExampleList[index].image = chat.groupImage;
      }
      else {
        this.chatExampleList[index].name = this.getSingleChatname(chat.users);

        this.chatExampleList[index].image = this.getSingleChatImg(chat.users);
        console.log(this.chatExampleList[index].name);
      }
    }
  }

  getSingleChatname(users: { idUser: string; nickname: string, image: string }[]): string {
    let control = this.friendList.filter((user) => user.id == users[0].idUser);
    console.log(this.friendList)
    console.log(control.length);
    console.log(users);
    if (control.length > 0)
      return users[0].nickname;
    else
      return users[1].nickname;
  }

  getSingleChatImg(users: { idUser: string; nickname: string, image: string }[]): string {
    let control = this.friendList.filter((user) => user.id == users[0].idUser);
    if (control.length > 0)
      return users[0].image;
    else
      return users[1].image;
  }

  messageFeature(newMsg: boolean, id: string = "") {
    if (!newMsg) {
      this.offsetChat = Math.floor(this.messageList[id].length / 50) + 1;
      console.log(this.offsetChat);
      setTimeout(() => {
        this.bottomScroll();
      }, 0);//to improve
    }
    else {
      this.offsetChat++;
      setTimeout(() => {
        this.bottomScroll(-1);
      }, 0);//to improve
    }
  }
  //#endregion
}
