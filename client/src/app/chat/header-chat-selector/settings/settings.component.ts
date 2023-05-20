import { Component, Output, EventEmitter } from '@angular/core';
import { HeaderService } from '../header.service';
import { ChatSelectorService } from '../../chat.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent {


  constructor(private headerService: HeaderService, public chatSelector:ChatSelectorService) { }
  user_action: number = -1; //-1 none, 0: info, 1: privacy, 2: chat, 3: language, 4: logout

  closeSettings()
  {
    this.headerService.generalClosing()
  }

  logout(){
    this.headerService.logout()
  }

  showInfo(type: number = 0){
    this.chatSelector.user_action = type;
  }
}
