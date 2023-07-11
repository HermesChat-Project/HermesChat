import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ChatSelectorService } from 'src/app/chat/chat.service';

@Component({
  selector: 'app-chat-creation',
  templateUrl: './chat-creation.component.html',
  styleUrls: ['./chat-creation.component.css']
})
export class ChatCreationComponent {
  constructor(public chatSelector: ChatSelectorService, @Inject(MAT_DIALOG_DATA) public data: any ) { }
}
