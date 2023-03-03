import { Component, ElementRef, ViewChild } from '@angular/core';
import { callsModel } from 'model/calls.model';
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
      new chatList(0, 0, 'Prova', "ok", "img", false, ["Username", "Prova"], "Lorem ipsum", new Date("2023/02/16 1:2:23")),
      new chatList(1, 15, 'Gruppo 1',"ok", "img", true, [""], 'Auguri', new Date(2022, 10, 23)),
      new chatList(2, 16, 'Gruppo 2',"ok", "img", true, [""], 'Ciao ', new Date()),
      new chatList(3, 17, 'Gruppo 3',"ok", "img", true, [""], 'Non so cosa scrivere', new Date()),
      new chatList(4, 18, 'Gruppo 4',"ok", "img", true, [""], 'DOTNET CORE', new Date()),
      new chatList(5, 19, 'Gruppo 5',"ok", "img", true, [""], 'Angular', new Date()),
      new chatList(6, 20, 'Gruppo 6',"ok", "img", true, [""], 'React', new Date()),
      new chatList(7, 21, 'Gruppo 7',"ok", "img", true, [""], 'Vue', new Date()),
      new chatList(6, 22, 'Gruppo 8',"ok", "img", true, [""], 'Node', new Date(2023, 2, 2)),
      new chatList(9, 23, 'Gruppo 9',"ok", "img", true, [""], 'MongoDB', new Date(2023, 2, 1)),
      new chatList(10, 24, 'PC',"ok", "img", true, [""], 'SQL', new Date(2023, 1, 12, 23, 15)),
    ], [1, 2, 3, 4, 5], [
      new callsModel(0, 0, 0, new Date(), 0),
      new callsModel(1, 0, 2, new Date(), 1),
      new callsModel(2, 0, 3, new Date(), 2),
      new callsModel(3, 0, 4, new Date(), 0),
      new callsModel(4, 0, 5, new Date(), 2),
      new callsModel(5, 0, 6, new Date(), 2),
      new callsModel(6, 0, 7, new Date(), 1),
      new callsModel(7, 0, 8, new Date(), 1),
      new callsModel(8, 0, 9, new Date(), 0),
      new callsModel(9, 0, 9, new Date(), 0)]),
    new userModel(1, 'Pippo', 'pippo@gmail.com', 'pippo', [], [0, 2, 3]),
    new userModel(2, 'Pluto', 'pluto@gmail.com', 'pluto', [], [0, 1, 3, 5]),
    new userModel(3, 'Paperino', 'paperino@gmail.com', 'paperino', [], [0, 1, 2]),
    new userModel(4, 'Paperone', 'paperone@gmail.com', 'paperone', [], [5, 6, 1, 2]),
    new userModel(5, 'Paperoga', 'paperoga@gmail.com', 'paperoga', [], [4, 6, 1]),
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
