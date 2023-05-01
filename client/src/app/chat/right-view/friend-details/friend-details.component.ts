import { Component } from '@angular/core';
import { ChatSelectorService } from '../../chat.service';
import { FriendModel } from 'model/friend.model';

@Component({
  selector: 'app-friend-details',
  templateUrl: './friend-details.component.html',
  styleUrls: ['./friend-details.component.css']
})
export class FriendDetailsComponent {
  constructor(public chatSelector: ChatSelectorService) { }

  createChat(selectedFriend : FriendModel)
  {
    this.chatSelector.createChat(selectedFriend);
  }
}
