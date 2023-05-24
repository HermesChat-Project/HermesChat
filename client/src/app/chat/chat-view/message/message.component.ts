import { Component, Input, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { messageModel } from 'model/message.model';
import { ChatSelectorService } from '../../chat.service';
import { ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DeleteMessageComponent } from 'src/app/dialog/delete-message/delete-message.component';
import { DomSanitizer } from '@angular/platform-browser';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class MessageComponent implements AfterViewInit {
  @Input() chatMessage!: messageModel;
  @Input() index!: number;
  @ViewChild("canvas") canvas!: ElementRef;
  @ViewChild('copy') copy!: ElementRef;
  @ViewChild("text") text!: ElementRef;
  messageActions: boolean = false;

  constructor(public chatSelector: ChatSelectorService, private dialog: MatDialog, private sanitizer: DomSanitizer) { }

  ngAfterViewInit(): void {
    this.text.nativeElement.querySelectorAll("img").forEach((img: HTMLImageElement) => {
      img.addEventListener("click", () => {
        this.chatSelector.src = img.src;

      })
    })
  }

  createId(option: any, message: messageModel) {
    let id = message.messages.dateTime.substring(0, 5) + message.messages.content + option.text
  }

  noSubmit(){
    return false;
  }

  changeVote(){

  }

  sanitize(url: string) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }



  getName(messages: messageModel) {
    if (messages.messages.options.exclusion)
      return this.chatMessage.messages.content;
    else
      return "";
  }

  checkInput(event: Event) {
    let el = (event.currentTarget as HTMLElement)
    if (el.previousElementSibling) {
      let input = el.previousElementSibling as HTMLInputElement;
      input.checked = !input.checked;
    }
  }
  alreadyTexted(i: number) {
    if (i != 0) {
      if (this.chatMessage.messages.idUser == this.chatSelector.messageList[this.chatSelector.selectedChat!._id][i - 1].messages.idUser && !this.differentDate(i))
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

  fullDateView(date: string) {
    let dateObj = new Date(date);
    //get the string like : thursay, 09 march 2023
    return dateObj.toLocaleDateString(this.chatSelector.userLang, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  }

  differentDate(i: number) {
    if (i != 0) {
      if (this.DateView(new Date(this.chatMessage.messages.dateTime)) == this.DateView(new Date(this.chatSelector.messageList[this.chatSelector.selectedChat!._id][i - 1].messages.dateTime)))
        return false;
      else
        return true;
    }
    return true;
  }
  getNameSender(id: string) {
    let nickname = this.chatSelector.friendList.find((friend) => friend.id == id)?.nickname;
    if (nickname == undefined)
      nickname = this.chatSelector.infoUser.nickname;
    return nickname;
  }

  getContent(content: string) {
    return content;
  }


  getTimeFormatted(date: string) {
    let dateObj = new Date(date);
    let hours = dateObj.getHours().toString();
    let minutes = dateObj.getMinutes().toString();
    if (minutes.length == 1)
      minutes = "0" + minutes;
    if (hours.length == 1)
      hours = "0" + hours;
    return hours + ":" + minutes;
  }


  copyToClipboard() {
    navigator.clipboard.writeText(this.chatMessage.messages.content).then(() => {
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
      panelClass: 'custom-dialog-container'
    }).afterClosed().subscribe((result: boolean) => { if (result) { this.deleteMsg() } })
  }

  deleteMsg() {
    this.chatSelector.messageList[this.chatSelector.selectedChat!._id].splice(this.index, 1);
  }

  changeIcon() {
    this.copy.nativeElement.classList.remove("bi-clipboard-check-fill");
    this.copy.nativeElement.classList.remove("bi-clipboard-x-fill");
    this.copy.nativeElement.classList.add("bi-clipboard-plus-fill");
  }

  hideActions() {
    this.messageActions = false;
  }

  scrollMsg(event: any) {

  }
}
