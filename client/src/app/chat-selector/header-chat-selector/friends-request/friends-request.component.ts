import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-friends-request',
  templateUrl: './friends-request.component.html',
  styleUrls: ['./friends-request.component.css']
})
export class FriendsRequestComponent {
  @Output() closeEvent = new EventEmitter<void>();
  receivedRequest: boolean = true;

  changeSelection(sent: boolean) {
    this.receivedRequest = sent;
  }

  close() {
    this.closeEvent.emit();
  }
}
