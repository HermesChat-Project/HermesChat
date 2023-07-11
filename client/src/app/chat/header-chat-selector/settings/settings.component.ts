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
