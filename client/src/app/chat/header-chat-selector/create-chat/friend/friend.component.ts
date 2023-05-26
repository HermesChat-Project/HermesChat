import { Component, Input, Output, EventEmitter } from '@angular/core';
import { AnimationOptions } from 'ngx-lottie';
import { FriendModel } from 'model/friend.model';

@Component({
  selector: 'app-friend',
  templateUrl: './friend.component.html',
  styleUrls: ['./friend.component.css']
})
export class FriendComponent {
  @Input() friend!: FriendModel;
  @Output() checkFriendEvent = new EventEmitter<{friend: FriendModel, check: boolean}>();
  constructor() { }
  check: boolean = false;

  options: AnimationOptions = {
    path: '../../../../../assets/animation/check.json',
    loop: false
  }

  checkFriend(){
    this.check = !this.check;
    this.checkFriendEvent.emit({friend: this.friend, check: this.check});
  }

}
