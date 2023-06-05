import { Component, createNgModule, ElementRef, ViewChild } from '@angular/core';
import { messageModel } from 'model/message.model';
import { ChatSelectorService } from '../chat.service';
import { ViewEncapsulation } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-chat-view',
  templateUrl: './chat-view.component.html',
  styleUrls: ['./chat-view.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ChatViewComponent {
  @ViewChild('textMessage') textMessage!: ElementRef;
  @ViewChild('fontStyling') fontStyling!: ElementRef;
  @ViewChild("messages") messages!: ElementRef;
  showChatActions: boolean = false;
  messageSent: string = '';
  selectedText: string = '';
  selection: Selection | null = null;
  contents: DocumentFragment | undefined = undefined;

  textSelectedOffsetStart: number = 0;
  textSelectedOffsetEnd: number = 0;

  serializer: XMLSerializer = new XMLSerializer();
  serializedStr: string = '';

  contentEditable: boolean = true;
  audioplay: boolean = false;

  audioRecorder: MediaRecorder | undefined = undefined;

  chatOptions: boolean = false;

  //for the css style of the buttons
  isBold: boolean = false;
  isItalic: boolean = false;
  isUnderline: boolean = false;
  isStrikethrough: boolean = false;
  isSuperscript: boolean = false;
  isSubscript: boolean = false;

  audioRecord: boolean = false;

  //camera variables
  isCameraPermitted: boolean = false;

  constructor(public chatSelector: ChatSelectorService) { }
  getMedia(event: any) {
    console.log(event);
    this.chatSelector.stream?.getTracks().forEach(track => track.stop());
    this.chatSelector.flagCamera = 0;
    let innerHTML = this.textMessage.nativeElement.innerrHTML == "" ? "" : "<br>";
    for (const media of event) {
      innerHTML += `<${media.type} src='${media.src}' style="max-width: 100%; max-height: 100%;"`;
      if (media.type == 'video')
        innerHTML += "></video>";
      else
        innerHTML += "/>";
      innerHTML += "<br><br>";
    }
    this.textMessage.nativeElement.innerHTML += innerHTML;
  }
  //#region messages type
  showCamera(type: number) {
    //check if the camera is permitted
    if (navigator.mediaDevices) {
      if (navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
          this.chatSelector.stream = stream;
          this.isCameraPermitted = true;
          this.chatSelector.flagCamera = type;
        }).catch((err: Error) => {
          this.isCameraPermitted = false;
          this.chatSelector.flagCamera = -1; //camera not permitted
          console.log('Please allow the camera to use this feature. Error: ', err.message);
        });
      }
    }
    else {
      this.chatSelector.flagCamera = -2; //camera not supported
      console.log("Camera not supported");
    }
    // this.chatSelector.flagCamera = type;

  }

  createSurvey() {
    this.chatSelector.openSurveyDialog();
  }

  createChart() {
    this.chatSelector.openChartDialog();
  }

  //#endregion

  toggleShowChatActions() {
    this.showChatActions = !this.showChatActions;
  }
  toggleChatOptions() {
    this.chatOptions = !this.chatOptions;
  }

  leaveGroup() {
    this.chatSelector.openLeaveGroupDialog(this.chatSelector.selectedChat!._id);
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
    if (this.selection)
      this.contents = this.selection.getRangeAt(0).cloneContents();//get the html content of the selection
    else
      this.contents = undefined;
    console.log(this.contents);
    if (this.contents != undefined && this.contents) {//check if the selection is not empty

      if (!this.checkIfFontStylingDivShouldBeShown()) {
        this.fontStyling.nativeElement.style.display = 'none';
        return;
      }
      if (this.selection != null) {
        this.selectedText = this.selection.toString();
        if (this.selectedText.length > 0) {
          let oRange = this.selection.getRangeAt(0); //get the text range
          let oRect = oRange.getBoundingClientRect();
          let top = oRect.top;
          let left = oRect.left;
          this.textSelectedOffsetEnd = oRange.endOffset;
          this.textSelectedOffsetStart = oRange.startOffset;
          this.fontStyling.nativeElement.style.top = (top - 37) + 'px';
          this.fontStyling.nativeElement.style.left = left + 'px';
          this.fontStyling.nativeElement.style.display = 'flex';

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
  closeModal(event: Event) {
    this.chatSelector.src = '';
  }

  toggleAudioPlay() {
    this.audioplay = !this.audioplay;
    if (this.audioplay)
      this.audioRecorder?.resume();
    else
      this.audioRecorder?.pause();
  }

  recordAudio() {
    let constraints = { audio: true };
    navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
      this.contentEditable = false;
      this.audioRecord = true;
      this.audioplay = true;
      this.audioRecorder = new MediaRecorder(stream);
      this.audioRecorder.start();
      let audioChunks: Blob[] = [];
      this.audioRecorder.addEventListener("dataavailable", (event: any) => {
        stream.getTracks().forEach(track => track.stop());
        console.log(event.data);
        audioChunks.push(event.data);
        let audioBlob = new Blob(audioChunks, { type: 'audio/mp3' });
        let audioUrl = URL.createObjectURL(audioBlob);
        console.log(audioUrl);
        let file = new File([audioBlob], "audio.mp3", { type: 'audio/mp3' });
        console.log(file);
        let formData = new FormData();
        formData.append('file', file);
        formData.append('chatId', this.chatSelector.selectedChat!._id);
        this.chatSelector.sendFile(formData)
          .then((filename: any) => {
            console.log(filename);
            this.contentEditable = true;
            this.audioRecord = false;
            this.chatSelector.messageList[this.chatSelector.selectedChat!._id].push(new messageModel({ content: "", dateTime: new Date().toISOString(), idUser: this.chatSelector.infoUser._id, type: "audio", options: {audio: audioUrl} }));

            this.chatSelector.sendMessage("", "audio", { audio: filename }, false);
          })
          .catch((err: HttpErrorResponse) => {
            console.log(err.message);
            this.contentEditable = true;
            this.audioRecord = false;
          });

      });

    })
      .catch((err: Error) => {
        console.log(err.message);
      });
  }
  sendMsg() {
    if (this.audioRecord) {
      this.audioRecorder?.stop();
    }
    else {
      let imgTags = this.textMessage.nativeElement.getElementsByTagName('img');

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
        //for every img tag add a div tag with the class img-container
        this.chatSelector.sendMessage(this.messageSent, "text");
        this.fontStyling.nativeElement.style.display = 'none';
        this.textMessage.nativeElement.innerHTML = '';
        this.textMessage.nativeElement.focus();
        this.chatSelector.sortChats();
        //go to the bottom of the chat
        // this.chatSelector.bottomScroll();
        this.fontStyling.nativeElement.style.display = 'none';
      }
    }
  }
  getFiles(event: any) {
    //get the files taken from the input file and convert them to binary
    let files = event.target?.files || event.dataTransfer.files;
    if (files) {
      let file = files[0];
      console.log(file);
      let formData = new FormData();
      formData.append('file', file);
      formData.append('chatId', this.chatSelector.selectedChat!._id);
      this.chatSelector.sendFile(formData).then((file: any) => {
        this.chatSelector.getFile(file, this.chatSelector.selectedChat!._id);
      }).catch((err: HttpErrorResponse) => {
        console.log(err.message);
      });
    }
  }

  shareCalendar() {
    this.chatSelector.shareCalendar();
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

  scrollMsg(event: any) {
    let el = event.currentTarget as HTMLElement;
    if (el.scrollHeight > el.clientHeight) {
      if (event.target.scrollTop == 0) {
        let body = {
          idChat: this.chatSelector.selectedChat!._id,
          offset: this.chatSelector.offsetChat
        }
        this.chatSelector.getChatMessages(body, this.chatSelector.selectedChat!._id, true);
      }
    }

  }

  //#region font style
  /*FONT STYLE SECTION (DANGER)*/

  toggleSelect(fonttype: string, showFontStyling: boolean = true) {
    if (fonttype == 'b') {
      this.isBold = showFontStyling
    }
    else if (fonttype == 'i') {
      this.isItalic = showFontStyling
    }
    else if (fonttype == 'u') {
      this.isUnderline = showFontStyling
    }
    else if (fonttype == 's') {
      this.isStrikethrough = showFontStyling
    }
    else if (fonttype == 'sup') {
      this.isSuperscript = showFontStyling
    }
    else if (fonttype == 'sub') {
      this.isSubscript = showFontStyling
    }

  }

  htmlEscape(str: string) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  getStartOffset(offsetStartOfNode: number, startContainer: Node, fontType: string) {
    let offset = offsetStartOfNode;
    let el = startContainer;
    console.log(el);
    let parent = el;
    while (parent.nodeName != fontType.toUpperCase()) {
      el = parent;
      parent = parent.parentNode!;
    }
    while (el.previousSibling != null && el.previousSibling.nodeName != "BR") {
      el = el.previousSibling;
      offset += el.textContent!.length;
    }
    return offset;
  }

  getTextBeforeAndAfterSelection(fonttype: string) {
    if (this.contents?.childElementCount == 1 && this.contents?.firstElementChild?.nodeName == fonttype.toUpperCase()) {
      //questo avviene solo quando hai appensa inserito un font e lo vuoi subito rimuovere
      let htmlString = this.contents?.firstElementChild?.innerHTML;
      this.selection?.getRangeAt(0).deleteContents();
      let newFragment = document.createRange().createContextualFragment(htmlString as string);
      this.selection?.getRangeAt(0).insertNode(newFragment);

      this.contents = this.selection?.getRangeAt(0).cloneContents();
    }
    else {
      //il common ancestor container è il primo elemento comune che contiene il testo selezionato
      let commonAncestorContainer = this.selection?.getRangeAt(0).commonAncestorContainer;
      while (commonAncestorContainer?.nodeName != fonttype.toUpperCase() && commonAncestorContainer?.nodeName != 'DIV') {
        commonAncestorContainer = commonAncestorContainer?.parentNode!;
      }
      console.log(commonAncestorContainer.nodeName);
      if (commonAncestorContainer?.nodeName != 'DIV') {
        let newRange = this.selection?.getRangeAt(0).cloneRange();
        let startContainer = this.selection?.getRangeAt(0).startContainer;
        let startingLine = this.getStartingLine(fonttype);// get the starting line of the selection
        let endingLine = this.getEndingLine(startingLine, this.textSelectedOffsetEnd); //get the ending line of the selection
        let serialised_string = this.serializer.serializeToString(this.contents as Node);

        serialised_string = serialised_string.replace(/xmlns="[^"]+"/g, '');
        serialised_string = serialised_string.replace(/\s+>/g, '>');
        serialised_string = serialised_string.replace(/<br\s*\/?>/mg, "<br>");

        let serialized_lines: string[] = serialised_string.split("<br>");
        this.selection?.getRangeAt(0).selectNode(commonAncestorContainer as Node);
        this.contents = this.selection?.getRangeAt(0).cloneContents();
        let html = this.contents?.firstElementChild?.innerHTML;
        let string_lines: string[] = html!.split("<br>");

        let startOffset: number;
        let endOffset: number;
        let newStr: string = '';
        let cont = 0;
        let wait = false;
        if (startingLine == endingLine) { //se la selezione è su una sola riga
          //get the offset of the start and the end of the slection of the starting line of the common ancestor container
          startOffset = this.getStartOffset(this.textSelectedOffsetStart, startContainer as Node, fonttype);
          endOffset = serialized_lines[startingLine].replace(/<[^>]*>/g, '').length + startOffset;

          for (let i = 0; i < string_lines[startingLine].length; i++) {
            if (string_lines[startingLine][i] == '<') {
              wait = true;
            }
            if (!wait) {
              if (cont == startOffset)
                newStr += '</' + fonttype + '>';
              if (cont == endOffset)
                newStr += '<' + fonttype + '>';

              cont++;
            }
            if (string_lines[startingLine][i] == '>') {
              wait = false;
            }
            newStr += string_lines[startingLine][i];
          }
          console.log(newStr);

          string_lines[startingLine] = newStr;
        }
        else {
          startOffset = string_lines[startingLine].length - serialized_lines[0].length
          endOffset = serialized_lines[serialized_lines.length - 1].length;
          for (let i = 0; i < string_lines[startingLine].length; i++) {
            if (string_lines[startingLine][i] == '<') {
              wait = true;
            }
            if (!wait) {
              if (cont == startOffset)
                newStr += '</' + fonttype + '>';
              cont++;
            }
            if (string_lines[startingLine][i] == '>') {
              wait = false;
            }
            newStr += string_lines[startingLine][i];
          }
          string_lines[startingLine] = newStr;
          newStr = ""
          for (let i = 0; i < string_lines[endingLine].length; i++) {
            newStr += string_lines[endingLine][i];
            if (i == endOffset - 1)
              newStr += '<' + fonttype + '>';
          }
          string_lines[endingLine] = newStr;
        }
        html = string_lines.join("<br>");
        this.selection?.getRangeAt(0).deleteContents();
        let newFragment = document.createRange().createContextualFragment("<" + fonttype + ">" + html + "</" + fonttype + ">" as string);
        console.log(newFragment);
        this.selection?.getRangeAt(0).insertNode(newFragment);
        this.contents = this.selection?.getRangeAt(0).cloneContents();

        //set new range
        this.selection?.removeAllRanges();
        this.selection?.addRange(newRange as Range);

      }
      else {
        //il commonAncestorContainer è un div
        let text_remaining_length = this.selection?.toString().length;
        let arrayContainer: any[] = [];
        let length_of_start_text = 0;
        let fullText = this.selection?.toString();
        console.log(fullText);
        let firstContainer = this.selection?.getRangeAt(0).startContainer;
        let lastContainer = this.selection?.getRangeAt(0).endContainer;
        let startOffset = this.getStartOffset(this.textSelectedOffsetStart, firstContainer as Node, fonttype);
        let commonFistContainer = firstContainer;
        while (commonFistContainer?.nodeName != "DIV") {
          firstContainer = commonFistContainer;
          commonFistContainer = commonFistContainer?.parentNode!;
        }
        arrayContainer.push(firstContainer);
        length_of_start_text = firstContainer?.textContent?.length! - startOffset;
        text_remaining_length = text_remaining_length! - length_of_start_text;
        let commonLastContainer = lastContainer;
        while (commonLastContainer?.nodeName != "DIV") {
          lastContainer = commonLastContainer;
          commonLastContainer = commonLastContainer?.parentNode!;
        }
        while (text_remaining_length! > 0) {
          let nextSibling = firstContainer?.nextSibling;
          arrayContainer.push(nextSibling);
          text_remaining_length -= nextSibling?.textContent?.length!;
        }
        // console.log(commonFistContainer, commonLastContainer);
        console.log(arrayContainer);

        let final_html = "";
        let cont = 0;
        let wait = false;
        let number_of_lines = this.selection?.toString().split("\n").length;
        text_remaining_length = this.selection!.toString().length - number_of_lines! + 1;
        console.log(text_remaining_length);
        for (let i = 0; i < arrayContainer.length; i++) {
          let htmlString = arrayContainer[i]?.innerHTML;
          if (i != 0 && i != arrayContainer.length - 1) {
            htmlString = "<" + fonttype + "></" + fonttype + ">" + htmlString + "</" + fonttype + "><" + fonttype + ">";
            final_html += htmlString;
            console.log(arrayContainer[i].innerText.length);
            text_remaining_length -= arrayContainer[i].innerText.length;
          }
          else {
            if (i == 0) {
              for (let j = 0; j < htmlString.length; j++) {
                if (htmlString[j] == '<') {
                  wait = true;
                }
                if (!wait) {
                  if (cont == startOffset) {
                    final_html += '</' + fonttype + '>';
                    text_remaining_length -= startOffset;
                  }
                  cont++;
                }
                if (htmlString[j] == '>') {
                  wait = false;
                }
                final_html += htmlString[j];
              }
            }
            else {
              cont = 0;
              wait = false;
              for (let j = 0; j < htmlString.length; j++) {
                if (htmlString[j] == '<') {
                  wait = true;
                }
                if (!wait) {
                  if (cont == text_remaining_length - 1) {
                    final_html += '<' + fonttype + '>';
                  }
                  cont++;
                }
                if (htmlString[j] == '>') {
                  wait = false;
                }
                final_html += htmlString[j];
              }
            }


          }
        }
        this.selection?.getRangeAt(0).setStart(firstContainer!, 0);
        this.selection?.getRangeAt(0).setEnd(lastContainer!, lastContainer?.childNodes?.length!);
        console.log(final_html);
        this.selection?.getRangeAt(0).deleteContents();
        let newFragment = document.createRange().createContextualFragment("<" + fonttype + ">" + final_html + "</" + fonttype + ">" as string);
        console.log(newFragment);
        this.selection?.getRangeAt(0).insertNode(newFragment);
        this.contents = this.selection?.getRangeAt(0).cloneContents();
      }
    }

    this.toggleSelect(fonttype, false);

  }
  hideFontStyling() {
    this.fontStyling.nativeElement.style.display = 'none';
  }
  getStartingLine(fonttype: string) {

    let line = 0;
    let startContainer = this.selection?.getRangeAt(0).startContainer;
    let parent = startContainer;
    while (parent?.nodeName != fonttype.toUpperCase()) {
      startContainer = parent;
      parent = parent?.parentNode!
    }
    let previousSibling = startContainer!.previousSibling;

    while (previousSibling != null) {
      if (previousSibling!.nodeName == 'BR') {
        line++;
      }
      previousSibling = previousSibling.previousSibling
    }


    return line;//linea di partenza rispetto al commonAncestorContainer
  }
  getEndingLine(startingLine: number, offsetEnd: number) {
    let line = startingLine;
    let lines = this.serializedStr.split('<br').length;
    return line + lines - 1;
  }
  getStylesAlreadyApplied() {
    this.isBold = false;
    this.isItalic = false;
    this.isUnderline = false;
    this.isStrikethrough = false;
    this.isSuperscript = false;
    this.isSubscript = false;

    let serializedStr = this.serializer.serializeToString(this.selection?.getRangeAt(0).cloneContents() as Node);
    this.serializedStr = serializedStr;
    let textOfTheSelectedText = this.selection?.getRangeAt(0).toString();

    let commonAncestorContainer = this.selection?.getRangeAt(0).commonAncestorContainer;
    if (commonAncestorContainer?.nodeName == 'DIV') {
      let b = this.contents?.querySelectorAll('b');
      let i = this.contents?.querySelectorAll('i');
      let u = this.contents?.querySelectorAll('u');
      let s = this.contents?.querySelectorAll('s');
      let sup = this.contents?.querySelectorAll('sup');
      let sub = this.contents?.querySelectorAll('sub');
      let textCompare = "";

      b?.forEach((element) => {
        textCompare += element.textContent;
      });
      if (textCompare == textOfTheSelectedText) {
        this.isBold = true;
      }


      textCompare = "";
      i?.forEach((element) => {
        textCompare += element.textContent;
      })
      if (textCompare == textOfTheSelectedText) {
        this.isItalic = true;
      }


      textCompare = "";
      u?.forEach((element) => {
        textCompare += element.textContent;
      });
      if (textCompare == textOfTheSelectedText) {
        this.isUnderline = true;
      }


      textCompare = "";
      s?.forEach((element) => {
        textCompare += element.textContent;
      });
      textCompare = "";
      if (textCompare == textOfTheSelectedText) {
        this.isStrikethrough = true;
      }

      textCompare = "";
      sup?.forEach((element) => {
        textCompare += element.textContent;
      });
      if (textCompare == textOfTheSelectedText) {
        this.isSuperscript = true;
      }

      textCompare = "";
      sub?.forEach((element) => {
        textCompare += element.textContent;
      });
      if (textCompare == textOfTheSelectedText) {
        this.isSubscript = true;
      }

    }
    else {
      let parentElement = commonAncestorContainer;
      while (parentElement?.nodeName != 'DIV') {
        if (parentElement!.nodeName == 'B') {
          this.isBold = true;
        }
        if (parentElement!.nodeName == 'I') {
          this.isItalic = true;
        }
        if (parentElement!.nodeName == 'U') {
          this.isUnderline = true;
        }
        if (parentElement!.nodeName == 'S') {
          this.isStrikethrough = true;
        }
        if (parentElement!.nodeName == 'SUP') {
          this.isSuperscript = true;
        }
        if (parentElement!.nodeName == 'SUB') {
          this.isSubscript = true;
        }
        parentElement = parentElement?.parentElement!;

      }
    }



  }

  checkIfFontStylingDivShouldBeShown() {
    if (this.contents) {
      let img = this.contents.querySelector('img');
      let video = this.contents.querySelector('video');
      let commonAncestor = this.selection?.getRangeAt(0).commonAncestorContainer;
      if ((img || video) || !(this.textMessage.nativeElement.contains(commonAncestor as Node))) {
        return false;
      }
      return true;
    }
    return false;
  }


  toggleFont(fonttype: string) {
    //get the html content of the document fragment
    this.serializedStr = this.serializer.serializeToString(this.contents as Node);

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
    console.log(this.serializedStr);
    console.log(this.contents)
    if (this.serializedStr.indexOf('<' + fonttype) != 0 && this.serializedStr.indexOf('</' + fonttype + '>') != this.serializedStr.length - ('</' + fonttype + '>').length) {
      this.serializedStr = this.serializedStr.replaceAll('<' + fonttype + ">", '');
      this.serializedStr = this.serializedStr.replaceAll('</' + fonttype + '>', '');
      this.insertTag(fonttype);
    }
    else if (this.serializedStr.indexOf('<' + fonttype) != 0 && this.serializedStr.indexOf('</' + fonttype + '>') == this.serializedStr.length - ('</' + fonttype + '>').length) {
      this.serializedStr = this.serializedStr.replaceAll('<' + fonttype + ">", '');
      this.serializedStr = this.serializedStr.replaceAll('</' + fonttype + '>', '');
      this.serializedStr = '<' + fonttype + '>' + this.serializedStr
      this.selection?.getRangeAt(0).deleteContents();
      this.selection?.getRangeAt(0).insertNode(this.selection?.getRangeAt(0).createContextualFragment(this.serializedStr) as Node);
      this.contents = this.selection?.getRangeAt(0).cloneContents();
    }
    else if (this.serializedStr.indexOf('<' + fonttype) == 0 && this.serializedStr.indexOf('</' + fonttype + '>') != this.serializedStr.length - ('</' + fonttype + '>').length) {
      this.serializedStr = this.serializedStr.replaceAll('</' + fonttype + '>', '');
      this.serializedStr = this.serializedStr + '</' + fonttype + '>';
      this.selection?.getRangeAt(0).deleteContents();
      this.selection?.getRangeAt(0).insertNode(this.selection?.getRangeAt(0).createContextualFragment(this.serializedStr) as Node);
      this.contents = this.selection?.getRangeAt(0).cloneContents();
    }

    this.toggleSelect(fonttype);
    console.log(this.contents)
  }



  insertTag(fonttype: string) {
    let style = document.createElement(fonttype);
    style.innerHTML = this.serializedStr;
    this.selection?.getRangeAt(0).deleteContents();
    this.selection?.getRangeAt(0).insertNode(style);
    this.contents = this.selection?.getRangeAt(0).cloneContents();
  }

  //#endregion

}
