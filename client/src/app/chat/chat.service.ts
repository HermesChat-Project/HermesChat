import { Injectable } from '@angular/core';
import { callsModel } from '../../../model/calls.model';
import { messageModel } from '../../../model/message.model';
import { DataStorageService } from '../shared/data-storage.service';
import { FriendModel } from 'model/friend.model';
import { CalendarModel } from 'model/calendar.model';
import { requestModel } from 'model/request.model';
import { Chat } from 'model/chat.model';
import { MatDialog } from '@angular/material/dialog';
import { SurveyComponent } from '../dialog/survey/survey.component';
import { ChartComponent } from '../dialog/chart/chart.component';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { SearchModel } from 'model/search.model';
import { ShareCalendarListComponent } from '../dialog/share-calendar-list/share-calendar-list.component';
import { LeaveGroupComponent } from '../dialog/leave-group/leave-group.component';
import { AddUserGroupComponent } from '../dialog/add-user-group/add-user-group.component';


@Injectable({
  providedIn: 'root'
})
export class ChatSelectorService {

  progress: number = 0;// wait until 6 calls are done

  infoUser: any//user info

  PersonalListSearch: Chat[] = [];//serach for personal chat
  OtherListSerach: SearchModel[] = [];//search list for other users

  friendList: FriendModel[] = [];//list of friends
  friendSerachList: FriendModel[] = [];//firend list for search

  receivedList: requestModel[] = [];//received frieedn request list
  sentList: { idUser: string, image: string, nickname: string }[] = [];//list of sent friend request

  chatList: Chat[] = [];//chat list

  messageList: { [key: string]: messageModel[] } = {};//json of message lists for each chat
  socketMessageList: { [key: string]: messageModel[] } = {};//json of message lists for each chat from socket (when a new message is received)

  user_action: number = -1; //-1 none, 0: info, 2: privacy, 3: graphics, 4: language, 5: theme, 6: logout, 7: info chat (not in the header section, ut placed in the same position) -> used to know which dialog to open
  offsetChat: number = 1 //offset for chat list (for retrieving more messages)
  theme: string = "light";

  callList: callsModel[] = [
    new callsModel(0, 1, 2, new Date(), 0),
    new callsModel(1, 1, 2, new Date(), 1),
    new callsModel(2, 2, 1, new Date(), 0),
    new callsModel(3, 2, 3, new Date(), 1),
  ];

  selectedChat: Chat | null = null;
  calendarSectionClicked: boolean = false;

  userLang = navigator.language || 'en-US';

  userNonChatFriendList: FriendModel[] = [];//list of friends that are not in chat

  src: string = "";
  flagCamera: number = 0; //0: off, 1: photo, 2: video, -1: camera not permitted, -2: camera not available
  stream: MediaStream | null = null;
  constructor(private dataStorage: DataStorageService, private dialog: MatDialog, private router: Router) { }



  //#region friend
  selectedFriend: FriendModel | null = null;

  createChat(friend: FriendModel) {
    let id = friend.id;
    let imgUser = this.infoUser.image;
    let friendImage = friend.image;
    let nickname = friend.nickname;
    this.createNewChat(id, imgUser, friendImage, nickname);
  }
  //#endregion

  //#region calendar
  calendarList: CalendarModel[] = []
  personalCalendarList: CalendarModel[] = []

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

  firstCalendarClick: boolean = true;

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
      if (day.length < 2)
        day = '0' + day;
      if (eventsPerDay[day]) {
        eventsPerDay[day].push(event);
      } else {
        eventsPerDay[day] = [event];
      }
    });
    return eventsPerDay;
  }

  //#endregion

  //#region toggle dialogs
  openDeleteMessgeDialog() {

  }
  chartType: number = 1; //1: bar, 2: pie, 3: line
  openSurveyDialog() {
    this.dialog.open(SurveyComponent, {
      panelClass: 'custom-dialog-container',
      width: '40%',
      minHeight: '50%',
      maxHeight: '70%',
    }).afterClosed().subscribe((result: any) => {
      if (result) {
        this.sendMessage(result.title, "survey", result.survey)
      }
    })
  }

  openChartDialog() {
    this.dialog.open(ChartComponent, {
      panelClass: 'custom-dialog-container',
      width: '70%',
      minHeight: '50%',
      maxHeight: '70%',
    }).afterClosed().subscribe((result: any) => {
      if (result) {
        console.log(result);
        this.sendMessage("", "chart", result.data)
      }
    })
  }

  openLeaveGroupDialog(id: string) {
    this.dialog.open(LeaveGroupComponent, {
      panelClass: 'custom-dialog-container'
    }).afterClosed().subscribe((result: any) => {
      if (result) {
        this.leaveGroup(id);
      }
    })
  }
  openAddUserDialog(){
    this.dialog.open(AddUserGroupComponent, {
      panelClass: 'custom-dialog-container',
      "data": this.userNonChatFriendList
    }).afterClosed().subscribe((result: any) => {
      if (result) {
        this.addUserToGroup(result);
      }
    })
  }
  shareCalendar() {
    if (this.calendarList.length == 0)
      this.getCalendarEvents();
    this.dialog.open(ShareCalendarListComponent, {
      panelClass: 'custom-dialog-container',
      width: '40%',
      minHeight: '50%',
      maxHeight: '70%',
    }).afterClosed().subscribe((result: CalendarModel[] | null) => {
      if (result) {
        console.log(result);

      }
    })
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

  sendMessage(message: string, type: string = 'text', options: any = null, localpush: boolean = true) {
    if (this.selectedChat) {
      if (localpush)
        this.messageList[this.selectedChat._id].push(new messageModel({ content: message, dateTime: new Date().toISOString(), idUser: this.infoUser._id, type: type, options: options }));

      this.socket?.send(JSON.stringify({ "type": "MSG", "idDest": this.selectedChat._id, "payload": message, "flagGroup": this.selectedChat.flagGroup, typeMSG: type, options: JSON.stringify(options) }));
      setTimeout(() => {
        this.bottomScroll();
      }, 0);//to improve

    }
  }

  //#endregion

  //#region server calls

  logoutCall() {
    this.dataStorage.PostRequestWithHeaders(`logout`, {}, this.getOptionsForRequest()).subscribe({
      next: (response: any) => {
        this.logout();
      },
      error: (error: HttpErrorResponse) => {
        if (error.status == 401)
          this.logout();
      }
    });
  }

  token: string = '';
  getInfo() {
    this.dataStorage.PostRequestWithHeaders(`getInfoUser`, {}, this.getOptionsForRequest()).subscribe({
      next: (response: any) => {
        this.infoUser = response.body;
        this.progress++;
        this.waitProgress();
      },
      error: (error: HttpErrorResponse) => {
        if (error.status == 401)
          this.logout();
      }
    });
  }

  getChats() {
    this.dataStorage.PostRequestWithHeaders(`getChats`, {}, this.getOptionsForRequest()).subscribe({
      next: (response: any) => {
        console.log(response);
        this.chatList = response.body.chats;

        this.changeName(response.body.chats);
        for (const chat of this.chatList) {
          if (this.messageList[chat._id] == undefined)
            this.messageList[chat._id] = [];
          if (this.socketMessageList[chat._id] == undefined)
            this.socketMessageList[chat._id] = [];
        }
        this.chatList.sort((a, b) => {
          let aDate = new Date(a.messages!.dateTime);
          let bDate = new Date(b.messages!.dateTime);
          return bDate.getTime() - aDate.getTime();
        })
        this.progress++;
        this.waitProgress();
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
        if (error.status == 401)
          this.logout();
      }
    });

  }

  getChatMessages(body: any, id: string, newMsg: boolean = false) {
    console.log(this.messageList)
    if ((this.messageList[id].length == 0) || newMsg) {
      this.dataStorage.PostRequestWithHeaders(`getMessages`, body, this.getOptionsForRequest()).subscribe({
        next: (response: any) => {
          console.log(response.body);
          if (response.body.messages) {

            response.body.messages.forEach(async (message: messageModel) => {
              if (message.messages.options && typeof message.messages.options === 'string')
                message.messages.options = JSON.parse(message.messages.options as string)
              if (message.messages.type == 'audio')
                await this.getFile(message.messages.options.audio, this.selectedChat?._id!).then((res: any) => {
                  let audioUrl = URL.createObjectURL(res.blob);
                  message.messages.options.audio = audioUrl;
                })
            });
            if (this.messageList[id]) {
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
          if (error.status == 401)
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
        if (response.body.friends) {
          this.friendList = response.body.friends;
          if (this.friendList.length > 0)
            this.friendList = this.friendList.sort((a: FriendModel, b: FriendModel) => { return a.name.localeCompare(b.name) });
          this.friendSerachList = this.friendList;
        }
        this.progress++;
        this.waitProgress();
        this.getChats();
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
        if (error.status == 401)
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
        if (error.status == 401)
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
        if (error.status == 401)
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
        if (error.status == 401)
          this.logout();
      }
    })
  }

  denyRequest(request: string) {
    this.dataStorage.PostRequestWithHeaders('declineFriend', { idUser: request }, this.getOptionsForRequest()).subscribe({
      next: (response: any) => {
        console.log(response);
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
        if (error.status == 401)
          this.logout();
      }
    })
  }




  createNewChat(id: string, img: string, friendImg: string, nickname: string) {
    let body = {
      "idUser": id,
      "img": img,
      "friendImg": friendImg,
      "friendNickname": nickname,
      "nickname": this.infoUser.nickname,
    }

    this.dataStorage.PostRequestWithHeaders('createChat', body, this.getOptionsForRequest()).subscribe({
      next: (response: any) => {
        console.log(response);
        this.chatList.push(response.body.chat);
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
        if (error.status == 401)
          this.logout();
      }
    })
  }

  createGroupChat(body: any) {
    this.dataStorage.PostRequestWithHeaders('createGroup', body, this.getOptionsForRequest()).subscribe({
      next: (response: any) => {
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
        if (error.status == 401)
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
        this.personalCalendarList = this.calendarList.filter((event: CalendarModel) => {
          return event.idUser == this.infoUser._id && event.date > new Date();
        })
        this.EventsPerMonth = this.getCalendarEventsByMonth();
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
        if (error.status == 401)
          this.logout();
      }
    })
  }

  leaveGroup(id: string = this.selectedChat!._id) {
    this.dataStorage.PostRequestWithHeaders('leaveGroup', { chatId: id }, this.getOptionsForRequest()).subscribe({
      next: (response: any) => {
        console.log(response);
        this.chatList = this.chatList.filter((chat: Chat) => {
          return chat._id != id;
        })
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
        if (error.status == 401)
          this.logout();
      }
    })
  }
  sendFriendRequest(user: SearchModel) {
    this.dataStorage.PostRequestWithHeaders('sendFriendRequest', { username: user.nickname }, this.getOptionsForRequest()).subscribe({
      next: (response: any) => {
        console.log(response);
        this.sentList.push({ idUser: user._id, image: user.image, nickname: user.nickname });
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
        if (error.status == 401)
          this.logout();

      }
    })
  }
  sendFile(file: FormData) {

    return new Promise((resolve, reject) => {
      this.dataStorage.PostRequestWithHeaders('sendFile', file, this.getFormDataOptions()).subscribe({
        next: (response: any) => {
          console.log(response);
          resolve(response.body.url[0]);
        },
        error: (error: HttpErrorResponse) => {
          console.log(error);
          if (error.status == 401)
            this.logout();
          reject(error);
        }
      })
    })

  }

  getFile(file: string, id: string) {
    return new Promise((resolve, reject) => {
      this.dataStorage.PostRequestWithHeaders('getFiles', { urls: file, chatId: id }, this.getFileOptions()).subscribe({
        next: (response: any) => {
          const blob: Blob = this.base64ToBlob(response.body.content, 'audio/mp3');
          resolve({ blob: blob });
        },
        error: (error: HttpErrorResponse) => {
          console.log(error);
          if (error.status == 401)
            this.logout();
          reject(error);
        }
      })
    })
  }

  getSearchUsers(txtUser: string) {
    this.dataStorage.getRequest('search?username=' + txtUser, this.getGetOptions()).subscribe({
      next: (response: any) => {
        console.log(response);
        if (response.body) {
          this.OtherListSerach = response.body;
          if (this.OtherListSerach.length > 10)
            this.OtherListSerach = this.OtherListSerach.slice(0, 10);
        }
        else {
          this.OtherListSerach = [];
        }
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
        if (error.status == 401)
          this.logout();
      }
    })
  }

  createCalendarEvent(body: any) {
    return new Promise((resolve, reject) => {
      this.dataStorage.PostRequestWithHeaders('addCalendarEvent', body, this.getOptionsForRequest()).subscribe({
        next: (response: any) => {
          console.log(response);
          resolve(response.body.event);
        },
        error: (error: HttpErrorResponse) => {
          console.log(error);
          if (error.status == 401)
            this.logout();
          reject(error);
        }
      })
    });
  }

  deleteCalendarEvent() {
    this.dataStorage.DeleteRequest('deleteCalendarEvent', this.getDeleteOptions()).subscribe({
      next: (response: any) => {
        console.log(response);
        this.calendarList.splice(this.calendarList.indexOf(this.selectedCalendarEvent!), 1);
        this.EventsPerMonth = this.getCalendarEventsByMonth();
        this.triggerCalendarModal = false;
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
        if (error.status == 401)
          this.logout();
      }
    });
  }

  removeUser(userId: string, chatId: string = this.selectedChat!._id) {
    this.dataStorage.PostRequestWithHeaders('removeUserFromGroup', { userId: userId, chatId: chatId }, this.getOptionsForRequest()).subscribe({
      next: (response: any) => {
        console.log(response);
        this.selectedChat!.users = this.selectedChat!.users.filter((user: { idUser: string; image: string; nickname: string; role:string }) => {
          return user.idUser != userId;
        }
        )
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
        if (error.status == 401)
          this.logout();
      }
    })
  }

  addUserToGroup(userId: string, chatId: string = this.selectedChat!._id) {
    this.dataStorage.PostRequestWithHeaders('addUserToGroup', { userId: userId, chatId: chatId }, this.getOptionsForRequest()).subscribe({
      next: (response: any) => {
        console.log(response);
        this.selectedChat!.users.push({ idUser: userId, image: response.body.image, nickname: response.body.nickname, role: response.body.role });
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
        if (error.status == 401)
          this.logout();
      }
    })
  }






  getDeleteOptions() {
    return {
      observe: 'response',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      withCredentials: true,
      body: {
        idEvent: this.selectedCalendarEvent!._id
      }
    };
  }




  getGetOptions() {
    return {
      observe: 'response',
      withCredentials: true
    };
  }
  getOptionsForRequest() {
    return {
      observe: 'response',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      withCredentials: true
    };
  }

  getFileOptions() {
    return {
      observe: 'response',
      headers: {
        'Content-Type': 'application/json; charset=utf-8;',
      },
      withCredentials: true
    };
  }
  getFormDataOptions() {
    return {
      observe: 'response',
      headers: {
        "Accept": "application/json"
      },
      withCredentials: true
    };
  }


  logout() {

    this.friendList = [];
    this.receivedList = [];
    this.sentList = [];
    this.friendSerachList = [];
    this.calendarSectionClicked = false;
    this.selectedChat = null;
    this.selectedFriend = null;
    this.infoUser = null;
    this.messageList = {};
    this.socketMessageList = {};
    this.chatList = [];
    this.progress = 0;
    this.PersonalListSearch = [];
    this.OtherListSerach = [];
    this.calendarList = [];
    this.EventsPerMonth = {};
    this.selectedCalendarEvent = null;
    this.selectedNotifyTime = "00:00";
    this.isPersonalEvent = true;
    this.router.navigate(['/login']);
  }





  //#endregion

  //#region socket

  socket: WebSocket | null = null;
  startSocket() {
    this.socket = new WebSocket('wss://10.88.229.127:8090/socket');
    this.socket.addEventListener("open", () => {
      console.log("socket open");
      this.progress++;
      this.waitProgress();
    });
    this.socket.addEventListener("message", (event) => {
      let data = JSON.parse(event.data);
      console.log(data);
      if (data.type == "MSG") {
        if (data.typeMSG == "audio") {
          let opt = JSON.parse(data.options);
          this.getFile(opt.audio, data.idDest).then((filedata: any) => {
            let blob = filedata.blob;
            let audioUrl = URL.createObjectURL(blob);
            if (this.messageList[data.idDest].length > 0) {
              this.messageList[data.idDest].push(new messageModel({ content: "", dateTime: new Date().toISOString(), idUser: data.index, type: 'audio', options: { audio: audioUrl } }));
              setTimeout(() => {
                this.bottomScroll(-1);
              }, 0);//to improve
            }
            else {
              this.socketMessageList[data.idDest].push(new messageModel({ content: "", dateTime: new Date().toISOString(), idUser: data.index, type: 'audio', options: { audio: audioUrl } }));
            }

          });
        }
        else {
          let opt;
          if (data.options)
            opt = JSON.parse(data.options);
          if (this.messageList[data.idDest].length > 0) {
            this.messageList[data.idDest].push(new messageModel({ content: data.payload, dateTime: new Date().toISOString(), idUser: data.index, type: 'text', options: opt }));
            setTimeout(() => {
              this.bottomScroll(-1);
            }, 0);//to improve
          }
          else {
            this.socketMessageList[data.idDest].push(new messageModel({ content: data.payload, dateTime: new Date().toISOString(), idUser: data.index, type: 'text', options: opt }));
          }
        }
      }
      else if (data.type == "FRA") {//friend request accepted
        let request: requestModel = data.friend;
        let id = request.idUser;
        this.sentList = this.sentList.filter((user) => user.idUser != id);
        let friend = new FriendModel(id, request.name, request.surname, request.nickname, request.image);
        this.friendList.push(friend);
      }
      else if (data.type == "FRR") {//friend request received
        let request: requestModel = data.friend;
        let requestUser = new requestModel(request.idUser, request.image, request.nickname, request.name, request.surname);
        this.receivedList.push(requestUser);
      }
      else if (data.type == "FRD") {//friend request denied
        let idUser = data.idUser;
        this.sentList = this.sentList.filter((user) => {

          return user.idUser != idUser;
        });
      }
      else if (data.type == "CEA") {//calendar event added
        if (!this.firstCalendarClick) {
          let event = data.event;
          let date = new Date(event.date)
          let eventModel = new CalendarModel(event.idCalendar, event.title, event.description, event.idUser, date, event.date, event.type, event.color, event.notify, event.notifyTime, event.idChats);
          this.calendarList.push(eventModel);
          this.EventsPerMonth = this.getCalendarEventsByMonth();
        }
      }
      else if (data.type == "CED") {//calendar event deleted
        if (!this.firstCalendarClick) {
          let id = data.idEvent
          this.calendarList = this.calendarList.filter((event) => event._id != id);
          this.EventsPerMonth = this.getCalendarEventsByMonth();
        }
      }
      else if (data.type == "CNG") {//create new group
        let chat = new Chat(data.chatId, data.user, true, data.name, data.img, data.description);
        this.chatList.push(chat);
        this.messageList[data.chatId] = [];
        this.socketMessageList[data.chatId] = [];
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
    console.log(this.progress);
    if (this.progress == 6) {
      this.seeMain = true;
    }
  }


  //chat
  changeName(chatList: any[]) {

    for (const [index, chat] of chatList.entries()) {
      if (chat.flagGroup) {
        this.chatList[index].name = chat.groupName;
        this.chatList[index].image = chat.groupImage;
      }
      else {
        this.chatList[index].name = this.getSingleChatname(chat.users);

        this.chatList[index].image = this.getSingleChatImg(chat.users);
      }
    }
  }

  getSingleChatname(users: { idUser: string; nickname: string, image: string }[]): string {
    let control = this.friendList.filter((user) => user.id == users[0].idUser);
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
  base64ToBlob(base64Data: string, contentType: string): Blob {
    const byteCharacters = window.atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);

    return new Blob([byteArray], { type: contentType });
  }

  //#endregion
}
