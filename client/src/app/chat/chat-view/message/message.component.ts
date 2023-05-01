import { Component, Input, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { messageModel } from 'model/message.model';
import { ChatSelectorService } from '../../chat.service';
import { ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DeleteMessageComponent } from 'src/app/dialog/delete-message/delete-message.component';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class MessageComponent implements AfterViewInit {
  @Input() chatMessage!: messageModel
  @Input() index!: number;
  @ViewChild('copy') copy!: ElementRef;
  @ViewChild("text") text!: ElementRef;
  messageActions: boolean = false;


  constructor(public chatSelector: ChatSelectorService, private dialog: MatDialog) { }

  ngAfterViewInit(): void {
    this.text.nativeElement.querySelectorAll("img").forEach((img: HTMLImageElement) => {
      img.addEventListener("click", () => {
        this.chatSelector.src = img.src;

      })
    })
  }

  alreadyTexted(i: number) {
    if (i != 0) {
      if (this.chatSelector.selectedChat?.messages[i].id_sender == this.chatSelector.selectedChat?.messages[i - 1].id_sender && !this.differentDate(i))
        return false;
      else
        return true;
    }
    return true;
  }

  toggleMessageActions() {
    this.messageActions = !this.messageActions;
  }

  DateView(date: Date) {
    /*get the yer, month and the day*/
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    return year + "/" + month + "/" + day;
  }

  fullDateView(date: Date) {
    //get the string like : thursay, 09 march 2023
    return date.toLocaleDateString(this.chatSelector.userLang, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  }

  differentDate(i: number) {
    if (i != 0) {
      if (this.DateView(this.chatSelector.selectedChat?.messages[i].sentAt as Date) == this.DateView(this.chatSelector.selectedChat?.messages[i - 1].sentAt as Date))
        return false;
      else
        return true;
    }
    return true;
  }





  getTimeFormatted(date: Date) {
    let hours = date.getHours().toString();
    let minutes = date.getMinutes().toString();
    if (minutes.length == 1)
      minutes = "0" + minutes;
    if (hours.length == 1)
      hours = "0" + hours;
    return hours + ":" + minutes;
  }


  copyToClipboard() {
    navigator.clipboard.writeText(this.chatMessage.message).then(() => {
      console.log("copied");
      this.copy.nativeElement.classList.add("bi-clipboard-check-fill");
      this.copy.nativeElement.classList.remove("bi-clipboard-plus-fill");
    })
      .catch((err: Error) => {
        console.log(err.message);
        this.copy.nativeElement.classList.add("bi-clipboard-x-fill");
        this.copy.nativeElement.classList.remove("bi-clipboard-plus-fill");
      });
  }

  openDialog() {
    this.dialog.open(DeleteMessageComponent, {
    panelClass: 'custom-dialog-container' }).afterClosed().subscribe((result: boolean) => {if(result){this.deleteMsg()}})
  }

  deleteMsg(){
    this.chatSelector.selectedChat?.messages.splice(this.index, 1);
  }

  changeIcon() {
    this.copy.nativeElement.classList.remove("bi-clipboard-check-fill");
    this.copy.nativeElement.classList.remove("bi-clipboard-x-fill");
    this.copy.nativeElement.classList.add("bi-clipboard-plus-fill");
  }

  hideActions() {
    this.messageActions = false;
  }
}
