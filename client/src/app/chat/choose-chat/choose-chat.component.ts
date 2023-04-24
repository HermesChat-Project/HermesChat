import { Component, ElementRef, ViewChild } from '@angular/core';
import { callsModel } from 'model/calls.model';
import { chatList } from 'model/chat-list.model';
import { userModel } from 'model/user.model';
import { ChatSelectorService } from '../chat.service';

@Component({
  selector: 'app-choose-chat',
  templateUrl: './choose-chat.component.html',
  styleUrls: ['./choose-chat.component.css']
})
export class ChooseChatComponent {

  @ViewChild("selected") div_selected!: ElementRef;
  @ViewChild("sections") div_sections!: ElementRef;


  constructor(public chatSelector: ChatSelectorService) { }

  day = new Date().getDate();
  width_section = 300;


  changeSelection(type: number, event: Event) {
    let target = event.currentTarget as HTMLElement;
    if(target.classList.contains("calendar")){
      this.chatSelector.calendarSectionClicked = true;
    }
    else{
      this.chatSelector.calendarSectionClicked = false;
    }
    let keyFrames: Keyframe[] = [
      { left: this.div_selected.nativeElement.offsetLeft + 'px' },
      { left: target.offsetLeft + 'px' }
    ];
    let options: object = {
      duration: 200,
      iterations: 1,
      fill: 'forwards',
      easing: 'ease-in-out'
    };
    this.div_selected.nativeElement.animate(keyFrames, options);

    let keyFrames2: Keyframe[] = [
      { left: this.div_sections.nativeElement.offsetLeft + 'px' },
      { left: -type * this.width_section + 'px' }
    ];

    this.div_sections.nativeElement.animate(keyFrames2, options);

    //this.div_sections.nativeElement.style.left = -type * this.width_section + 'px';


  }




}
