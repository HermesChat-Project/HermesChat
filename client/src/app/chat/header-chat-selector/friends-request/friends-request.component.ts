import { Component, Output, EventEmitter } from '@angular/core';
import { HeaderService } from '../header.service';
import { ChatSelectorService } from '../../chat.service';

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
}
