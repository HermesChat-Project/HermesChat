import { Component, ElementRef, ViewChild } from '@angular/core';
import { messageModel } from 'model/message.model';
import { ChatSelectorService } from '../chat.service';
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
  selectedText: string = '';
  textSelectedOffset: number = 0;
  messageOnCreation: string = '';
  selection: Selection | null = null;

  contents: DocumentFragment | undefined;

  constructor(public chatSelector: ChatSelectorService) { }

  toggleShowChatActions() {
    this.showChatActions = !this.showChatActions;
  }
  hideShowChatActions(event: Event) {
    //get the focused element
    console.log("hideShowChatActions");
    let focusedElement = document.activeElement;
    console.log(focusedElement);
    console.log(this.textMessage.nativeElement);
    console.log(event.target);
    // this.showChatActions = this.textMessage.nativeElement.contains(focusedElement);
  }

  getSelection() {
    this.selection = window.getSelection();
    this.contents = this.selection?.getRangeAt(0).cloneContents();//get the html content of the selection
    //see if there is a img tag inside the selection
    console.log(this.contents);
    console.log(this.contents?.textContent);
    // const serializer = new XMLSerializer();
    // const str = serializer.serializeToString(this.contents as Node);
    // console.log(str);
    if (this.contents) {//check if the selection is not empty

      if (!this.checkIfFontStylingDivShouldBeShown()) {
        this.fontStyling.nativeElement.style.display = 'none';
        return;
      }
      if (this.selection != null) {
        this.selectedText = this.selection.toString();
        console.log(this.selectedText);
        if (this.selectedText.length > 0) {
          let oRange = this.selection.getRangeAt(0); //get the text range
          let oRect = oRange.getBoundingClientRect();
          let top = oRect.top;
          let left = oRect.left;
          //get the position of the selected text based on the full text
          this.textSelectedOffset = oRange.startOffset;
          this.fontStyling.nativeElement.style.top = (top - 37) + 'px';
          this.fontStyling.nativeElement.style.left = left + 'px';
          this.fontStyling.nativeElement.style.display = 'block';
        }
        else {
          this.hideFontStyling();
        }

      }
      else {
        this.hideFontStyling();
      }
    }


  }
  hideFontStyling() {
    this.fontStyling.nativeElement.style.display = 'none';
  }

  checkIfFontStylingDivShouldBeShown() {
    if (this.contents) {
      let img = this.contents.querySelector('img');
      let video = this.contents.querySelector('video');
      if (img || video) {
        return false;
      }
      return true;
    }
    return false;
  }



  sendMsg() {
    this.messageSent = this.textMessage.nativeElement.innerHTML;
    //delete the first <br> tags
    console.log(this.messageSent);
    while (this.messageSent.indexOf('<br>') == 0) {
      this.messageSent = this.messageSent.replace('<br>', '');
    }
    //delete the last <br> tags
    while (this.messageSent.lastIndexOf('<br>') == this.messageSent.length - 4 && this.messageSent.length > 4) {
      this.messageSent = this.messageSent.substring(0, this.messageSent.length - 4);
    }

    if (this.messageSent.length > 0) {
      this.chatSelector.sendMessage(this.messageSent);
      this.textMessage.nativeElement.innerHTML = '';
      this.textMessage.nativeElement.focus();
      this.chatSelector.sortChats();
      //go to the bottom of the chat
      this.chatSelector.bottomScroll();
    }
  }
  getImages(event: any) {
    //get the images taken from the input file and convert them to base64
    let files = event.target?.files || event.dataTransfer.files;
    for (let i = 0; i < files.length; i++) {
      let reader = new FileReader();
      reader.readAsDataURL(files[i]);
      reader.onload = () => {
        let br = document.createElement('br');
        this.textMessage.nativeElement.appendChild(br);
        let div = document.createElement('div');
        div.innerHTML = '<img src="' + reader.result + '" style="max-width: 100%; max-height: 100%;"/>';
        this.textMessage.nativeElement.appendChild(div);
      }
    }
    this.textMessage.nativeElement.focus();
  }
  keyAction(event: KeyboardEvent) {
    if (event.key == 'Enter' && !event.shiftKey) {
      this.sendMsg();
      event.preventDefault();
    }
  }

  pastedMessage(event: ClipboardEvent) {
    //remove the style from the pasted text without using execCommand
    let text = event.clipboardData!.getData('text/plain');
    console.log(text);
    if (text.length > 0) {
      //insert the text without the style at the cursor position without using execCommand
      event.preventDefault();
      let selection = window.getSelection();
      if (selection != null) {
        let range = selection.getRangeAt(0);
        range.deleteContents();
        let textNode = document.createTextNode(text);
        range.insertNode(textNode);
        range.setStartAfter(textNode);
        range.setEndAfter(textNode);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }
    this.hideFontStyling();
    console.log(event.clipboardData);
  }

  toggleFont(fonttype: number) {
    //get the html content of the document fragment
    console.log(this.contents);
    const serializer = new XMLSerializer();
    const str = serializer.serializeToString(this.contents as Node);
    console.log(str);
    //check if the selected text is already styled
    if (this.checkIfSelectedTextIsStyled()) {
      //remove the style
      if (fonttype == 1) { //bold
        let b = this.contents?.querySelector('b');
        if (b) {
          let text = b.innerHTML;
          b.remove();
          this.selection?.getRangeAt(0).deleteContents();
          this.selection?.getRangeAt(0).insertNode(document.createTextNode(text));
        }
      }
      else if (fonttype == 2) { //italic
        let i = this.contents?.querySelector('i');
        if (i) {
          let text = i.innerHTML;
          i.remove();
          this.selection?.getRangeAt(0).deleteContents();
          this.selection?.getRangeAt(0).insertNode(document.createTextNode(text));
        }
      }
      else if (fonttype == 3) { //underline
        let u = this.contents?.querySelector('u');
        if (u) {
          let text = u.innerHTML;
          u.remove();
          this.selection?.getRangeAt(0).deleteContents();
          this.selection?.getRangeAt(0).insertNode(document.createTextNode(text));
        }
      }
      else if (fonttype == 4) { //strike
        let s = this.contents?.querySelector('s');
        if (s) {
          let text = s.innerHTML;
          s.remove();
          this.selection?.getRangeAt(0).deleteContents();
          this.selection?.getRangeAt(0).insertNode(document.createTextNode(text));
        }
      }
    }
    else {
      if (fonttype == 1) {  //bold
        let b = document.createElement('b');
        b.innerHTML = this.selectedText;
        this.selection?.getRangeAt(0).deleteContents();
        this.selection?.getRangeAt(0).insertNode(b);
      }
      else if (fonttype == 2) { //italic
        let i = document.createElement('i');
        i.innerHTML = this.selectedText;
        this.selection?.getRangeAt(0).deleteContents();
        this.selection?.getRangeAt(0).insertNode(i);
      }
      else if (fonttype == 3) { //underline
        let u = document.createElement('u');
        u.innerHTML = this.selectedText;
        this.selection?.getRangeAt(0).deleteContents();
        this.selection?.getRangeAt(0).insertNode(u);
      }
      else if (fonttype == 4) { //strike
        let s = document.createElement('s');
        s.innerHTML = this.selectedText;
        this.selection?.getRangeAt(0).deleteContents();
        this.selection?.getRangeAt(0).insertNode(s);
      }
      else if (fonttype == 5) { //superscript

        let sup = document.createElement('sup');
        sup.innerHTML = this.selectedText;
        this.selection?.getRangeAt(0).deleteContents();
        this.selection?.getRangeAt(0).insertNode(sup);
      }
      else if (fonttype == 6) { //subscript
        let sub = document.createElement('sub');
        sub.innerHTML = this.selectedText;
        this.selection?.getRangeAt(0).deleteContents();
        this.selection?.getRangeAt(0).insertNode(sub);
      }

      this.contents = this.selection?.getRangeAt(0).cloneContents();
      console.log(this.contents);

    }
  }

  checkIfSelectedTextIsStyled() {
    //check if the selected text is already styled or is contained in a styled element
    return false;
  }

}
