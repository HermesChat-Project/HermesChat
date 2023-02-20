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


  chatList: userModel[] = [
    new userModel(0, 'Username', 'email', 'password', [
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
    ], [1, 2, 3]),
    new userModel(1, 'Pippo', 'pippo@gmail.com', 'pippo', [], [0, 2, 3]),
    new userModel(2, 'Pluto', 'pluto@gmail.com', 'pluto', [], [0, 1, 3]),
    new userModel(3, 'Paperino', 'paperino@gmail.com', 'paperino', [], [0, 1, 2]),
    new userModel(4, 'Paperone', 'paperone@gmail.com', 'paperone', [], [5, 6]),
    new userModel(5, 'Paperoga', 'paperoga@gmail.com', 'paperoga', [], [4, 6]),
    new userModel(6, 'Paperina', 'paperina@gmail.com', 'paperina', [], [4, 5]),
    new userModel(7, 'Qui', 'qui@gmail.com', 'qui', [], [8, 9]),
    new userModel(8, 'Quo', 'quo@gmail.com', 'quo', [], [7, 9]),
    new userModel(9, 'Qua', 'qua@gmail.com', 'qua', [], [7, 8])
  ];

  day = new Date().getDate();
  width_section = 300;


  changeSelection(type: number, event: Event) {

    let target = event.currentTarget as HTMLElement;
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
