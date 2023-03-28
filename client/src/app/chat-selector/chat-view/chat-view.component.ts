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
  selectedText: string = '';
  textSelectedOffset: number = 0;
  messageOnCreation: string = '';
  styling: any = {
    bold: [] as any[],
    italic: [] as any[],
    ulined: [] as any[],
    sub: [] as any[],
    sup: [] as any[],
    strike: [] as any[],
  }

  contents: DocumentFragment | undefined;

  constructor(public chatSelector: ChatSelectorService) { }

  toggleShowChatActions() {
    this.showChatActions = !this.showChatActions;
  }
  hideShowChatActions() {
    //get the focused element
    this.showChatActions = false;
  }

  getSelection() {
    const selection = window.getSelection();
    this.contents = selection?.getRangeAt(0).cloneContents();//get the html content of the selection
    //see if there is a img tag inside the selection
    if (this.contents) {//check if the selection is not empty

      if (!this.checkIfFontStylingDivShouldBeShown()) {
        this.fontStyling.nativeElement.style.display = 'none';
        return;
      }
      if (selection != null) {
        this.selectedText = selection.toString();
        console.log(this.selectedText);
        if (this.selectedText.length > 0) {
          let oRange = selection.getRangeAt(0); //get the text range
          console.log(oRange);
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
          this.fontStyling.nativeElement.style.display = 'none';
        }

      }
      else {
        this.fontStyling.nativeElement.style.display = 'none';
      }
    }
    // const text = this.textMessage.nativeElement;
    // if (selection && selection.anchorNode && selection.focusNode) {
    //   const selectionStartsAtElement = selection.anchorNode.parentNode;// get the element where the selection starts
    //   const selectionEndsAtElement = selection.focusNode.parentNode;// get the element where the selection ends
    //   console.log(selectionStartsAtElement);
    //   console.log(selectionEndsAtElement);
    //   if (selectionStartsAtElement === text && selectionEndsAtElement === text) { // if the selection is inside the text
    //     console.log('no markup elements have been selected');


    //   }
    //   else {

    //     const areElementsSelectedInsideText = text.contains(selectionStartsAtElement) && text.contains(selectionEndsAtElement);
    //     console.log(areElementsSelectedInsideText);
    //     if (areElementsSelectedInsideText) {
    //       console.log('markup elements have been selected');

    //       let parentElementsForSelectionEnd;
    //       let parentElementsForSelectionStart;

    //       // get selection end elements
    //       if (selectionEndsAtElement !== text) {
    //         parentElementsForSelectionEnd = [selectionEndsAtElement];

    //         let nextParentAtSelectionEnd = selectionEndsAtElement!.parentNode;

    //         while (nextParentAtSelectionEnd !== text) {
    //           parentElementsForSelectionEnd.push(nextParentAtSelectionEnd);
    //           nextParentAtSelectionEnd = nextParentAtSelectionEnd!.parentNode;
    //         }
    //       }

    //       // get selection start elements
    //       if (selectionStartsAtElement !== text) {
    //         parentElementsForSelectionStart = [selectionStartsAtElement];

    //         let nextParentAtSelectionStart = selectionStartsAtElement!.parentNode;

    //         while (nextParentAtSelectionStart !== text) {
    //           parentElementsForSelectionStart.push(nextParentAtSelectionStart);
    //           nextParentAtSelectionStart = nextParentAtSelectionStart!.parentNode;
    //         }
    //       }

    //       // do what ever you need here
    //       // (as I understood - you should highlight buttons somewhere)
    //       console.log(parentElementsForSelectionStart);
    //       console.log(parentElementsForSelectionEnd);
    //     }
    //   }
    // }

  }
  hideFontStyling() {
    // this.fontStyling.nativeElement.style.display = 'none';
  }

  checkIfFontStylingDivShouldBeShown() {
    if(this.contents){
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
    if (text.length > 0) {
      event.preventDefault();
      //insert the text without the style at the cursor position without using execCommand
      let range: Range | undefined = window.getSelection()?.getRangeAt(0);
      let newNode = document.createTextNode(text);
      range?.insertNode(newNode);
      range?.setStartAfter(newNode);
      range?.setEndAfter(newNode);
      window.getSelection()?.removeAllRanges();
      window.getSelection()?.addRange(range!);
    }
    console.log(event.clipboardData);
  }

  toggleFont(fonttype: number) {
    if (this.selectedText.length > 0) {

      switch (fonttype) {
        case 1:
          //tag the selected text with <b> tag
          let b_index = this.checkIfTagged(this.styling.bold, this.selectedText, this.textSelectedOffset);
          if (b_index == -1) {
            this.styling.bold.push({ "start": this.textSelectedOffset, "end": this.textSelectedOffset + this.selectedText.length, "text": this.selectedText })
          }
          else {
            this.styling.bold.splice(b_index, 1);
          }
          this.styling.bold = this.styling.bold.sort((a: any, b: any) => a.start - b.start);
          this.createText()
          break;
        case 2:
          //tag the selected text with <i> tag
          let i_index = this.checkIfTagged(this.styling.italic, this.selectedText, this.textSelectedOffset);
          if (i_index == -1) {

            this.styling.italic.push({ "start": this.textSelectedOffset, "end": this.textSelectedOffset + this.selectedText.length, "text": this.selectedText })
          }
          else {
            this.styling.italic.splice(i_index, 1);
          }
          this.styling.italic = this.styling.italic.sort((a: any, b: any) => a.start - b.start);

          break;
        case 3:
          //tag the selected text with <u> tag
          this.styling.ulined.push({ "start": this.textSelectedOffset, "end": this.textSelectedOffset + this.selectedText.length, "text": this.selectedText })
          this.textMessage.nativeElement.innerHTML = this.replaceText(this.selectedText, '<u>' + this.selectedText + '</u>', this.textSelectedOffset);
          break;
        case 4:
          //tag the selected text with <sub> tag
          this.styling.sub.push({ "start": this.textSelectedOffset, "end": this.textSelectedOffset + this.selectedText.length, "text": this.selectedText })
          this.textMessage.nativeElement.innerHTML = this.replaceText(this.selectedText, '<sub>' + this.selectedText + '</sub>', this.textSelectedOffset);
          break;
        case 5:
          //tag the selected text with <sup> tag
          this.styling.sup.push({ "start": this.textSelectedOffset, "end": this.textSelectedOffset + this.selectedText.length, "text": this.selectedText })
          this.textMessage.nativeElement.innerHTML = this.replaceText(this.selectedText, '<sup>' + this.selectedText + '</sup>', this.textSelectedOffset);
          break;
        case 6:
          //tag the selected text with <s> tag
          this.styling.srike.push({ "start": this.textSelectedOffset, "end": this.textSelectedOffset + this.selectedText.length, "text": this.selectedText })
          this.textMessage.nativeElement.innerHTML = this.replaceText(this.selectedText, '<s>' + this.selectedText + '</s>', this.textSelectedOffset);

      }
      console.log(this.styling);
    }



  }
  replaceText(text: string, newText: string, offset: number) {

    let textMessage = this.textMessage.nativeElement.innerHTML;
    let newTextMessage = textMessage.substring(0, offset) + newText + textMessage.substring(offset + text.length, textMessage.length);
    return newTextMessage;

  }

  checkIfTagged(tag: any[], text: string, offset: number) {
    let index = -1;
    for (let i = 0; i < tag.length; i++) {
      if (tag[i].start == offset && tag[i].end == offset + text.length) {
        index = i;
        break;
      }
    }
    return index;
  }

  createText() {
    let textMessage = this.textMessage.nativeElement.innerText;
    console.log(textMessage);
    let newTextMessage = '';
    let bold = this.styling.bold;
    let italic = this.styling.italic;
    let ulined = this.styling.ulined;
    let sub = this.styling.sub;
    let sup = this.styling.sup;
    let strike = this.styling.strike;

    let boldIndex = 0;
    let italicIndex = 0;
    let ulinedIndex = 0;
    let subIndex = 0;
    let supIndex = 0;
    let srikeIndex = 0;
    let first_str;
    let last_str;
    newTextMessage = textMessage;
    //bold
    for (let i = 0; i < textMessage.length; i++) {
      if (italicIndex < italic.length && i == italic[italicIndex].start) {
        first_str = newTextMessage.substring(0, i);
        last_str = newTextMessage.substring(i, newTextMessage.length);
        newTextMessage = first_str + '<i>' + last_str;
      }
      if (italicIndex < italic.length && i == italic[italicIndex].end) {
        first_str = newTextMessage.substring(0, i + 3);
        last_str = newTextMessage.substring(i + 3, newTextMessage.length);
        newTextMessage = first_str + '</i>' + last_str;
        italicIndex++;
      }
      if (boldIndex < bold.length && i == bold[boldIndex].start) {
        first_str = newTextMessage.substring(0, i);
        last_str = newTextMessage.substring(i, newTextMessage.length);
        newTextMessage = first_str + '<b>' + last_str;
      }
      if (boldIndex < bold.length && i == bold[boldIndex].end) {
        first_str = newTextMessage.substring(0, i + 3);
        last_str = newTextMessage.substring(i + 3, newTextMessage.length);
        newTextMessage = first_str + '</b>' + last_str;
        boldIndex++;
      }

    }

    this.textMessage.nativeElement.innerHTML = newTextMessage;
  }


}
