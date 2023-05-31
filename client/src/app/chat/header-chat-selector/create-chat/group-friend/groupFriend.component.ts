import { Component, Input, Output, EventEmitter } from '@angular/core';
import { AnimationOptions, LottieCacheModule, LottieDirective, LottieTransferState } from 'ngx-lottie';
import { FriendModel } from 'model/friend.model';

@Component({
  selector: 'app-friend',
  templateUrl: './groupFriend.component.html',
  styleUrls: ['./groupFriend.component.css']
})
export class FriendComponent {
  @Input() friend!: FriendModel;
  @Output() checkFriendEvent = new EventEmitter<{friend: FriendModel, check: boolean}>();
  constructor() { }
  check: boolean = false;

  options : AnimationOptions ={
    path: '../../../../../assets/animation/check.json',
    loop: false,

  };

  checkFriend(){
    this.check = !this.check;
    this.checkFriendEvent.emit({friend: this.friend, check: this.check});
  }

}
