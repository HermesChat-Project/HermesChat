import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ChatSelectorService } from 'src/app/chat/chat.service';

@Component({
  selector: 'app-delete-message',
  templateUrl: './delete-message.component.html',
  styleUrls: ['./delete-message.component.css']
})
export class DeleteMessageComponent {

  constructor(private dialogRef: MatDialogRef<DeleteMessageComponent>, public chatSelector: ChatSelectorService) { }
  deleteMessage() {
    this.dialogRef.close(true);
  }
}
