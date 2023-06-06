import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FriendModel } from 'model/friend.model';
import { ChatSelectorService } from 'src/app/chat/chat.service';

@Component({
  selector: 'app-add-user-group',
  templateUrl: './add-user-group.component.html',
  styleUrls: ['./add-user-group.component.css']
})
export class AddUserGroupComponent {
  constructor(public chatSelector: ChatSelectorService, @Inject(MAT_DIALOG_DATA) public friendList: FriendModel[]) { }
  friendAdded: FriendModel[] = [];

  checkFriend(friend: FriendModel) {
    if (this.friendAdded.find(f => f.id == friend.id)) {
      return true;
    }
    return false;
  }
}
