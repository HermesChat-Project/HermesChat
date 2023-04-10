import { Injectable } from '@angular/core';
import { userModel } from '../../../model/user.model';
import { chatList } from '../../../model/chat-list.model';
import { callsModel } from '../../../model/calls.model';
import { messageModel } from '../../../model/message.model';
import { DataStorageService } from '../shared/data-storage.service';
import { FriendModel } from 'model/friendModel';

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
      new chatList(1, 15, 'Gruppo 1',"ok", "img",[
        new messageModel(0, 0, 'Username', 'ok', new Date(2022, 8, 12)),
        new messageModel(1, 0, 'Username', 'ok', new Date(2021, 8, 13)),
        new messageModel(2, 1, 'Pippo', 'Bene', new Date(2021, 8, 14)),
        new messageModel(3, 2, 'Pluto', 'Ciao', new Date(2021, 8, 15)),
        new messageModel(4, 0, 'Username', 'Prova messaggi', new Date(2022, 11, 31)),
      ],  true, [""]),
      new chatList(2, 16, 'Gruppo 2',"ok", "img",[
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
      new chatList(3, 17, 'Gruppo 3',"ok", "img",[
        new messageModel(0, 1, 'Pippo', 'ok', new Date(2023, 1, 13)),
        new messageModel(1, 2, 'Pluto', 'ok', new Date(2023, 2, 13)),
        new messageModel(2, 3, 'Paperino', 'Bene', new Date(2023, 2, 14)),
        new messageModel(3, 2, 'Pluto', 'Ciao', new Date(2023, 2, 15)),
        new messageModel(4, 3, 'Paperino', 'ok', new Date(2011, 2, 15, 12, 30, 0)),
      ], true, [""]),
      new chatList(4, 18, 'Gruppo 4',"ok", "img",[
        new messageModel(0, 1, 'Pippo', 'ok', new Date(2023, 1, 13)),
        new messageModel(1, 2, 'Pluto', 'ok', new Date(2023, 2, 13)),
        new messageModel(2, 3, 'Paperino', 'Bene', new Date(2023, 2, 14)),
        new messageModel(3, 2, 'Pluto', 'Ciao', new Date(2023, 2, 15)),
        new messageModel(4, 3, 'Paperino', 'ok', new Date()),
      ], true, [""]),
      new chatList(5, 19, 'Gruppo 5',"ok", "img",[
        new messageModel(0, 1, 'Pippo', 'ok', new Date(2023, 2, 13)),
        new messageModel(1, 2, 'Pluto', 'ok', new Date(2023, 2, 13)),
        new messageModel(2, 3, 'Paperino', 'Bene', new Date(2023, 2, 14)),
        new messageModel(3, 2, 'Pluto', 'Ciao', new Date(2023, 2, 15)),
        new messageModel(4, 3, 'Paperino', 'Angular', new Date()),
      ], true, [""]),
      new chatList(6, 20, 'Gruppo 6',"ok", "img",[
        new messageModel(0, 1, 'Pippo', 'ok', new Date(2023, 1, 13)),
        new messageModel(1, 2, 'Pluto', 'ok', new Date(2023, 2, 13)),
        new messageModel(2, 3, 'Paperino', 'Bene', new Date(2023, 2, 14)),
        new messageModel(3, 2, 'Pluto', 'Ciao', new Date(2023, 2, 15)),
        new messageModel(4, 3, 'Paperino', 'Mongo db', new Date()),
      ], true, [""]),
      new chatList(7, 21, 'Gruppo 7',"ok", "img",[
        new messageModel(0, 1, 'Pippo', 'ok', new Date(2023, 1, 13)),
        new messageModel(1, 2, 'Pluto', 'ok', new Date(2023, 2, 13)),
        new messageModel(2, 3, 'Paperino', 'Bene', new Date(2023, 2, 14)),
        new messageModel(3, 2, 'Pluto', 'Ciao', new Date(2023, 2, 15)),
        new messageModel(4, 3, 'Paperino', 'DOTNET CORE', new Date())
      ], true, [""]),
      new chatList(6, 22, 'Gruppo 8',"ok", "img",[
        new messageModel(0, 1, 'Pippo', 'ok', new Date(2023, 1, 13)),
        new messageModel(1, 2, 'Pluto', 'ok', new Date(2023, 2, 13)),
        new messageModel(2, 3, 'Paperino', 'Bene', new Date(2023, 2, 14)),
        new messageModel(3, 2, 'Pluto', 'Ciao', new Date(2023, 2, 15)),
        new messageModel(4, 3, 'Paperino', 'SQL', new Date())
      ], true, [""]),
      new chatList(9, 23, 'Gruppo 9',"ok", "img",[
        new messageModel(0, 1, 'Pippo', 'Ciao', new Date(2023, 1, 13)),
      ], true, [""]),
      new chatList(10, 24, 'PC',"ok", "img",[
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
  userLang = navigator.language || 'en-US';
  src: string = "";
  flagCamera: number = 0; //0: off, 1: photo, 2: video, -1: camera not permitted, -2: camera not available
  constructor(private dataStorage: DataStorageService) { }
  sendMessage(message: string) {
    if (this.selectedChat) {
      let i = this.getMaxIndex(this.selectedChat)
      this.selectedChat.messages.push(new messageModel(i + 1, 0, 'Username', message, new Date()));
      setTimeout(() => {
        this.bottomScroll();
      }, 0);//to improve
    }
  }

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
}
