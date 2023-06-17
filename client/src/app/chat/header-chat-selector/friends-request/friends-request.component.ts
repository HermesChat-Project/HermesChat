import { Component, Output, EventEmitter } from '@angular/core';
import { HeaderService } from '../header.service';
import { ChatSelectorService } from '../../chat.service';
import { requestModel } from 'model/request.model';
import { FriendModel } from 'model/friend.model';

@Component({
  selector: 'app-friends-request',
  templateUrl: './friends-request.component.html',
  styleUrls: ['./friends-request.component.css']
})
export class FriendsRequestComponent {
  receivedRequest: boolean = true;

  constructor(private headerService: HeaderService, public chatSelector: ChatSelectorService) { }

  changeSelection(sent: boolean) {
    this.receivedRequest = sent;
  }

  close() {
    this.headerService.generalClosing();
  }

  denyFriend(request: requestModel, index: number) {
    let id = request.idUser;
    this.chatSelector.receivedList.splice(index, 1);
    this.chatSelector.denyRequest(id);
  }

  addFriend(request: requestModel, index: number) {
    let image = request.image == "" ? "." : request.image;
    this.chatSelector.receivedList.splice(index, 1);
    this.chatSelector.acceptRequest(request);
    let friend = new FriendModel(request.idUser, request.name, request.surname, request.nickname, image);
    this.chatSelector.friendList.push(friend);
  }
}
