import { Component } from '@angular/core';
import { ChatSelectorService } from '../../chat.service';

@Component({
  selector: 'app-friend-details',
  templateUrl: './friend-details.component.html',
  styleUrls: ['./friend-details.component.css']
})
export class FriendDetailsComponent {
  constructor(public chatSelector: ChatSelectorService) { }
}
