import { Component } from '@angular/core';
import { ChatSelectorService } from '../../chat.service';

@Component({
  selector: 'app-camera',
  templateUrl: './camera.component.html',
  styleUrls: ['./camera.component.css']
})
export class CameraComponent {
  constructor(private chatSelector: ChatSelectorService) { }

  closeWebcam(){
    this.chatSelector.flagCamera = 0;
  }
}
