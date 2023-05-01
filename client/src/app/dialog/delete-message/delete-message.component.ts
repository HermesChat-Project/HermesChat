import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-message',
  templateUrl: './delete-message.component.html',
  styleUrls: ['./delete-message.component.css']
})
export class DeleteMessageComponent {

  constructor(private dialogRef: MatDialogRef<DeleteMessageComponent>) { }

  closeDialog() {
    this.dialogRef.close(false);
  }

  deleteMessage() {
    this.dialogRef.close(true);
  }
}
