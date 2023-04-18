import { Component, Output, EventEmitter } from '@angular/core';
import { HeaderService } from '../header.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent {


  constructor(private headerService: HeaderService) { }

  closeSettings()
  {
    this.headerService.generalClosing()
  }

  logout(){
    this.headerService.logout()
  }
}
