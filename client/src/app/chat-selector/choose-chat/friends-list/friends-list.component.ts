import { Component, Input } from '@angular/core';
import { userModel } from 'model/user.model';

@Component({
  selector: 'app-friends-list',
  templateUrl: './friends-list.component.html',
  styleUrls: ['./friends-list.component.css']
})
export class FriendsListComponent {
  @Input() friendList!: userModel[];
  list: any[] = [];
  ngOnInit(): void {
    this.getFriendListOf(0);
  }

  getFriendListOf(id: number) {
    let id_array: number[] = this.friendList[id].friend_id;
    this.list = id_array.map((id) => this.friendList[id]);
  }
}
