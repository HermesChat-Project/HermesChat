import { Component } from '@angular/core';
import { ChatSelectorService } from 'src/app/chat/chat.service';

@Component({
  selector: 'app-leave-group',
  templateUrl: './leave-group.component.html',
  styleUrls: ['./leave-group.component.css']
})
export class LeaveGroupComponent {
  constructor(public chatSelector:ChatSelectorService) {}
}
