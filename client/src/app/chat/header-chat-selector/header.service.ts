import { Injectable } from '@angular/core';

import {Location} from '@angular/common';
import { ChatSelectorService } from '../chat.service';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {

  constructor( private location: Location, private chatSelector: ChatSelectorService) { }

  typeOfAction: number = 0;
  chatCreationType: number = 0;
  generalClosing() {
    this.typeOfAction = 0;
  }

  logout() {
    this.typeOfAction = 0;
    this.chatSelector.selectedChat = null;
    this.location.back();
  }
}
