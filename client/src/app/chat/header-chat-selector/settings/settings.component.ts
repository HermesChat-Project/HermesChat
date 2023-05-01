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
  user_action: number = -1; //-1 none, 0: info, 2: privacy, 3: graphics, 4: language, 5: theme, 6: logout

  closeSettings()
  {
    this.headerService.generalClosing()
  }

  logout(){
    this.headerService.logout()
  }

  showUserInfo(){
    this.chatSelector.user_action = 0;
  }
}
