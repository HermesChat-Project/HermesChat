import { Component, ElementRef, ViewChild } from '@angular/core';
import { messageModel } from 'model/message.model';
import { ChatSelectorService } from '../chat-selector.service';
import { ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-chat-view',
  templateUrl: './chat-view.component.html',
  styleUrls: ['./chat-view.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ChatViewComponent {
  @ViewChild('textMessage') textMessage!: ElementRef;
  @ViewChild('fontStyling') fontStyling!: ElementRef;
  showChatActions: boolean = false;
  messageSent: string = '';

  constructor(public chatSelector: ChatSelectorService) { }

  toggleShowChatActions() {
    this.showChatActions = !this.showChatActions;
  }
  hideShowChatActions() {
    this.showChatActions = false;
  }

  getSelection() {
    //get the selected text
    let selected = window.getSelection();
    let slectedtext: string;

    if (selected != null) {
      slectedtext = selected.toString();
      console.log(slectedtext);
      if (slectedtext.length > 0) {
        let oRange = selected.getRangeAt(0); //get the text range
        let oRect = oRange.getBoundingClientRect();
        let top = oRect.top;
        let left = oRect.left;
        this.fontStyling.nativeElement.style.top = (top - 37) + 'px';
        this.fontStyling.nativeElement.style.left = left + 'px';
        this.fontStyling.nativeElement.style.display = 'block';
      }
      else {
        this.fontStyling.nativeElement.style.display = 'none';
      }

    }
    else {
      this.fontStyling.nativeElement.style.display = 'none';
    }

  }
  hideFontStyling() {
    this.fontStyling.nativeElement.style.display = 'none';
  }



  sendMsg() {
    this.messageSent = this.textMessage.nativeElement.innerHTML;
    if (this.messageSent.length > 0) {
      console.log(this.messageSent)
      this.chatSelector.sendMessage(this.messageSent);
      this.textMessage.nativeElement.innerHTML = '';
      this.textMessage.nativeElement.focus();
    }
  }

  keyAction(event: KeyboardEvent) {
    if (event.key == 'Enter' && !event.shiftKey) {
      this.sendMsg();
      event.preventDefault();
    }
  }

  pastedMessage(event: any) {
    let text = event.clipboardData?.getData('text/plain');
    console.log(text);
    if (text == null || text.length <= 0) {


    }
  }


}
