import { Component, ElementRef, ViewChild } from '@angular/core';
import { chatList } from 'model/chat-list.model';
import { userModel } from 'model/user.model';

@Component({
  selector: 'app-choose-chat',
  templateUrl: './choose-chat.component.html',
  styleUrls: ['./choose-chat.component.css']
})
export class ChooseChatComponent {

  @ViewChild("selected") div_selected!: ElementRef;
  @ViewChild("sections") div_sections!: ElementRef;


  chatList = new userModel(0, 'name', 'email', 'password', [
    new chatList('Prova', 'Lorem ipsum', new Date("2023/02/16 1:2:23"), 'img'),
    new chatList('Gruppo 1', 'Boh', new Date(), 'img'),
    new chatList('Gruppo 2', 'Ciao ', new Date(), 'img'),
    new chatList('Gruppo 3', 'Non so cosa scrivere', new Date(), 'img'),
    new chatList('Gruppo 4', 'DOTNET CORE', new Date(), 'img'),
    new chatList('Gruppo 5', 'Angular', new Date(), 'img'),
    new chatList('Gruppo 6', 'React', new Date(), 'img'),
    new chatList('Gruppo 7', 'Vue', new Date(), 'img'),
    new chatList('Gruppo 8', 'Node', new Date(), 'img'),
    new chatList('Gruppo 9', 'MongoDB', new Date(), 'img')
  ])
  selected_function = 0;//0 = chat, 1 = friend, 2 = calls, 3 = calendar
  day = new Date().getDate();
  width_section = 300;


  changeSelection(type: number, event: Event) {

    let target = event.currentTarget as HTMLElement;
    console.log(target)
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
