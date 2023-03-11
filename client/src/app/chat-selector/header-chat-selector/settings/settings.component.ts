import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent {
  @Output() closeProfile = new EventEmitter<void>();

  closeSettings()
  {
    this.closeProfile.emit();
  }
}
