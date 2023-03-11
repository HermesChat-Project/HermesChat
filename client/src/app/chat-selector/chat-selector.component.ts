import { Component } from '@angular/core';
import { ChatSelectorService } from './chat-selector.service';

@Component({
  selector: 'app-chat-selector',
  templateUrl: './chat-selector.component.html',
  styleUrls: ['./chat-selector.component.css']
})
export class ChatSelectorComponent {
  constructor(public chatSelector: ChatSelectorService) { }
}
