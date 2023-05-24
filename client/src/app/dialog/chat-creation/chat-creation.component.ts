import { Component, Input } from '@angular/core';
import { ChatSelectorService } from 'src/app/chat/chat.service';

@Component({
  selector: 'app-chat-creation',
  templateUrl: './chat-creation.component.html',
  styleUrls: ['./chat-creation.component.css']
})
export class ChatCreationComponent {
  @Input() nickname!: string;
  constructor(public chatSelector: ChatSelectorService) { }
}
