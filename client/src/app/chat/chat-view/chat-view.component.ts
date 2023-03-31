import { Component, createNgModule, ElementRef, ViewChild } from '@angular/core';
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
  selection: Selection | null = null;
  contents: DocumentFragment | undefined;

  textSelectedOffsetStart: number = 0;
  textSelectedOffsetEnd: number = 0;
  textSelectedLineFirst: number = 0;
  textSelectedLineLast: number = 0;

  serializer: XMLSerializer = new XMLSerializer();
  serializedStr: string = '';

  //for the css style of the buttons
  isBold: boolean = false;
  isItalic: boolean = false;
  isUnderline: boolean = false;
  isStrikethrough: boolean = false;
  isSuperscript: boolean = false;
  isSubscript: boolean = false;

  constructor(public chatSelector: ChatSelectorService) { }

  toggleShowChatActions() {
    this.showChatActions = !this.showChatActions;
  }
  hideShowChatActions(event: Event) {
    //get the focused element
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
          this.textSelectedOffsetEnd = oRange.endOffset;
          this.textSelectedOffsetStart = oRange.startOffset;
          console.log(this.textSelectedOffsetStart);
          console.log(this.textSelectedOffsetEnd);
          this.fontStyling.nativeElement.style.top = (top - 37) + 'px';
          this.fontStyling.nativeElement.style.left = left + 'px';
          this.fontStyling.nativeElement.style.display = 'block';

          this.getStylesAlreadyApplied();
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

  getTextBeforeAndAfterSelection(fonttype: string) {
    let commonAncestorContainer = this.selection?.getRangeAt(0).commonAncestorContainer;
    while (commonAncestorContainer?.nodeName != fonttype.toUpperCase()) {
      commonAncestorContainer = commonAncestorContainer?.parentNode!;
    }
    console.log(commonAncestorContainer);

    let serializedString = this.serializer.serializeToString(commonAncestorContainer as Node);
    console.log(serializedString);
    serializedString = serializedString.replaceAll(/xmlns="[^"]+"/g, '');
    serializedString = serializedString.replaceAll("<" + fonttype + " >", '<' + fonttype + ">");
    //regex that make br don't have space between the tag and the >
    let regex = /<br\s*\/?>/gi;
    serializedString = serializedString.replaceAll(regex, "<br/>");
    let startingLine = this.getStartingLine();
    let endingLine = this.getEndingLine(startingLine, this.textSelectedOffsetEnd);

    let wait: boolean = false;
    let htmlString = '';
    //recreate the html string
    let lines = serializedString.split('<br/>')
    let cont = 0;
    console.log(lines);
    for (let i = 0; i < lines.length; i++) {
      if (i < startingLine || i > endingLine || (i > startingLine && i < endingLine)) {
        htmlString += lines[i] + '<br/>';
      }
      else {
        if (i == startingLine && startingLine != endingLine) {
          for (let j = 0; j < lines[i].length; j++) {
            if (lines[i][j] == '<') {
              wait = true;
            }
            if (!wait) {
              if (cont == this.textSelectedOffsetStart) {
                htmlString += '</' + fonttype + '>';
              }
              cont++;
            }
            if (lines[i][j] == '>') {
              wait = false;
            }
            htmlString += lines[i][j];
          }
          htmlString += '<br/>';
        }
        else if (i == endingLine && endingLine != startingLine) {
          cont = 0;
          for (let j = 0; j < lines[i].length; j++) {
            if (lines[i][j] == '<') {
              wait = true;
            }
            if (!wait) {
              if (cont == this.textSelectedOffsetEnd) {
                htmlString += '<' + fonttype + '>';
              }
              cont++;
            }
            if (lines[i][j] == '>') {
              wait = false;
            }
            htmlString += lines[i][j];
          }
        }
        else if (i == startingLine && i == endingLine) {
          cont = 0;
          for (let j = 0; j < lines[i].length; j++) {
            if (lines[i][j] == '<') {
              wait = true;
            }
            if (!wait) {
              if (cont == this.textSelectedOffsetStart) {
                htmlString += '</' + fonttype + '>';
              }
              if (cont == this.textSelectedOffsetEnd) {
                htmlString += '<' + fonttype + '>';
              }
              cont++;
            }
            if (lines[i][j] == '>') {
              wait = false;
            }
            htmlString += lines[i][j];
          }
        }
      }

      console.log(htmlString);
      //replace all the &lt; and other html entities


    }

    console.log(htmlString);
    //change range to commonAncestorContainer and set the html string
    this.selection?.getRangeAt(0).selectNode(commonAncestorContainer as Node);
    this.selection?.getRangeAt(0).deleteContents();
    let fragment = document.createRange().createContextualFragment(htmlString);
    this.selection?.getRangeAt(0).insertNode(fragment);
    this.selection?.getRangeAt(0).collapse(false);


  }
  hideFontStyling() {
    this.fontStyling.nativeElement.style.display = 'none';
  }
  getStartingLine() {

    let line = 0;
    let previousSibling = this.selection?.getRangeAt(0).startContainer.previousSibling;
    console.log(this.selection?.getRangeAt(0).startContainer.nodeValue);
    while (previousSibling != null) {
      console.log(previousSibling);
      if (previousSibling!.nodeName == 'BR') {
        line++;
      }
      previousSibling = previousSibling.previousSibling;
    }


    return line;//linea di partenza rispetto al commonAncestorContainer
  }
  getEndingLine(startingLine: number, offsetEnd: number) {
    let line = startingLine;
    let lines = this.serializedStr.split('<br').length;
    return line + lines - 1;
  }
  getStylesAlreadyApplied() {

    let serializedStr = this.serializer.serializeToString(this.selection?.getRangeAt(0).cloneContents() as Node);
    this.serializedStr = serializedStr;
    console.log(serializedStr);
    //get the parent of the selection
    let parent = this.selection?.getRangeAt(0).commonAncestorContainer.parentElement; //genitore del container comune
    let commonAncestorContainer = this.selection?.getRangeAt(0).commonAncestorContainer; //container comune. Può essere un testo o un tag
    // check if commonAncestorContainer is just text
    console.log(parent?.nodeName);
    let tagsContainingSelectedText: any[] = [];
    if (commonAncestorContainer?.nodeName == '#text') {
      while (parent?.nodeName != 'DIV') {
        tagsContainingSelectedText.push(parent?.nodeName);
        parent = parent?.parentElement;
      }
    }
    else {
      if (commonAncestorContainer?.nodeName != 'DIV')
        tagsContainingSelectedText.push(commonAncestorContainer!.nodeName);
      while (parent?.nodeName != 'DIV') {
        tagsContainingSelectedText.push(parent?.nodeName);
        parent = parent?.parentElement;
      }

    }
    //check if tagsContainingSelectedText contains a bold, italic, underline, strikethrough, superscript or subscript
    this.isBold = tagsContainingSelectedText.includes('B');
    this.isItalic = tagsContainingSelectedText.includes('I');
    this.isUnderline = tagsContainingSelectedText.includes('U');
    this.isStrikethrough = tagsContainingSelectedText.includes('S');
    this.isSuperscript = tagsContainingSelectedText.includes('SUP');
    this.isSubscript = tagsContainingSelectedText.includes('SUB');

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
      this.fontStyling.nativeElement.style.display = 'none';
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
      //insert the text without the style at the cursor position without using execCommand
      event.preventDefault();
      let selection = window.getSelection();
      if (selection != null) {
        let range = selection.getRangeAt(0);
        range.deleteContents();
        text = text.replaceAll(/\n/g, '<br>');//replace the new line with <br>
        let newDiv = document.createElement('div');//create a div to insert the text
        newDiv.innerHTML = text;//insert the text. Without it the text will be inserted as plain text, so no html tags will be inserted
        range.insertNode(newDiv as Node);
        range.setStartAfter(newDiv as Node);
        range.setEndAfter(newDiv as Node);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }
    this.hideFontStyling();
  }

  toggleFont(fonttype: string) {
    //get the html content of the document fragment
    console.log(this.contents);
    console.log(this.contents?.nextSibling);
    this.serializedStr = this.serializer.serializeToString(this.contents as Node);
    console.log(this.serializedStr);
    this.serializedStr = this.serializedStr.replaceAll(/xmlns="[^"]+"/g, '');
    this.serializedStr = this.serializedStr.replaceAll("<" + fonttype + " >", '<' + fonttype + ">");

    if (fonttype == 'b' && this.isBold) {
      this.getTextBeforeAndAfterSelection(fonttype);
    }
    else if (fonttype == 'i' && this.isItalic) {
      this.getTextBeforeAndAfterSelection(fonttype);

    }
    else if (fonttype == 'u' && this.isUnderline) {
      this.getTextBeforeAndAfterSelection(fonttype);
    }
    else if (fonttype == 's' && this.isStrikethrough) {
      this.getTextBeforeAndAfterSelection(fonttype);
    }
    else if (fonttype == 'sup' && this.isSuperscript) {
      this.getTextBeforeAndAfterSelection(fonttype);
    }
    else if (fonttype == 'sub' && this.isSubscript) {
      this.getTextBeforeAndAfterSelection(fonttype);
    }
    else {
      this.insertStyle(fonttype);
    }

    //get the parent element of the selected text


  }

  insertStyle(fonttype: string) {
    // console.log(this.serializedStr);
    // console.log(this.serializedStr.indexOf('<' + fonttype));
    // this.serializedStr = this.serializedStr.replaceAll('<' + fonttype + ">", '');
    // this.serializedStr = this.serializedStr.replaceAll('</' + fonttype + '>', '');
    // let style = document.createElement(fonttype);
    // style.innerHTML = this.serializedStr;
    // this.selection?.getRangeAt(0).deleteContents();
    // this.selection?.getRangeAt(0).insertNode(style);
    // this.contents = this.selection?.getRangeAt(0).cloneContents();

    // let nextSibling = style.nextElementSibling;
    // console.log(nextSibling);
    // let childrenSibling = nextSibling
    // while (childrenSibling != null && childrenSibling.nodeName != fonttype.toUpperCase()) {
    //   console.log(childrenSibling.nodeName);
    //   childrenSibling = childrenSibling?.children.item(0)!;
    // }
    // if (childrenSibling != null) {
    //   if (childrenSibling.textContent == nextSibling?.textContent) {
    //     style.innerHTML += childrenSibling.innerHTML;
    //     childrenSibling.remove();
    //   }
    // }

    // let prevSibling = style.previousElementSibling;
    // childrenSibling = prevSibling
    // while(childrenSibling != null && childrenSibling.nodeName != fonttype.toUpperCase()){
    //   childrenSibling = childrenSibling?.children.item(0)!;
    // }
    // if(childrenSibling != null){
    //   if(childrenSibling.textContent == prevSibling?.textContent){
    //     style.innerHTML = childrenSibling.innerHTML + style.innerHTML;
    //     childrenSibling.remove();
    //   }
    // }
    // console.log(style);



    if (this.serializedStr.indexOf('<' + fonttype) != 0 && this.serializedStr.indexOf('</' + fonttype + '>') != this.serializedStr.length - ('</' + fonttype + '>').length) {
      this.serializedStr = this.serializedStr.replaceAll('<' + fonttype + ">", '');
      this.serializedStr = this.serializedStr.replaceAll('</' + fonttype + '>', '');
      this.insertTag(fonttype);
      console.log("tipo 1");
    }
    else if (this.serializedStr.indexOf('<' + fonttype) != 0 && this.serializedStr.indexOf('</' + fonttype + '>') == this.serializedStr.length - ('</' + fonttype + '>').length) {
      this.serializedStr = this.serializedStr.replaceAll('<' + fonttype + ">", '');
      this.serializedStr = this.serializedStr.replaceAll('</' + fonttype + '>', '');
      this.serializedStr = '<' + fonttype + '>' + this.serializedStr
      console.log(this.serializedStr);
      this.selection?.getRangeAt(0).deleteContents();
      this.selection?.getRangeAt(0).insertNode(this.selection?.getRangeAt(0).createContextualFragment(this.serializedStr) as Node);
      this.contents = this.selection?.getRangeAt(0).cloneContents();

      console.log("tipo 2");
    }
    else if (this.serializedStr.indexOf('<' + fonttype) == 0 && this.serializedStr.indexOf('</' + fonttype + '>') != this.serializedStr.length - ('</' + fonttype + '>').length) {
      this.serializedStr = this.serializedStr.replaceAll('</' + fonttype + '>', '');
      this.serializedStr = this.serializedStr + '</' + fonttype + '>';
      console.log(this.serializedStr);
      this.selection?.getRangeAt(0).deleteContents();
      this.selection?.getRangeAt(0).insertNode(this.selection?.getRangeAt(0).createContextualFragment(this.serializedStr) as Node);
      this.contents = this.selection?.getRangeAt(0).cloneContents();
      console.log("tipo 3");
    }
    console.log(this.serializedStr);
    // this.adjustText()
  }

  adjustText() {



  }

  insertTag(fonttype: string) {
    let style = document.createElement(fonttype);
    style.innerHTML = this.serializedStr;
    this.selection?.getRangeAt(0).deleteContents();
    this.selection?.getRangeAt(0).insertNode(style);
    this.contents = this.selection?.getRangeAt(0).cloneContents();
  }

}
