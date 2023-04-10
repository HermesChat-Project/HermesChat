import { Component } from '@angular/core';
import { ChatSelectorService } from '../../chat.service';
import { WebcamInitError } from 'ngx-webcam';

@Component({
  selector: 'app-camera',
  templateUrl: './camera.component.html',
  styleUrls: ['./camera.component.css']
})
export class CameraComponent {
  constructor(public chatSelector: ChatSelectorService) { }

  seconds: number = 0;
  minutes: number = 0;
  hours: number = 0;
  timer: any = null;
  closeWebcam() {
    this.chatSelector.flagCamera = 0;
  }

  cameraProblem(event: WebcamInitError) {
    console.log(event);
  }

  takeMedia() {
    if (this.chatSelector.flagCamera == 1) {
      console.log("Photo taken");
    }
    else {
      if (!this.timer) {
        console.log("Video Start");
        this.timer = setInterval(() => {
          this.seconds++;
          if (this.seconds == 60) {
            this.seconds = 0;
            this.minutes++;
          }
          if (this.minutes == 60) {
            this.minutes = 0;
            this.hours++;
          }


        }, 1000);
      }
      else {
        clearInterval(this.timer);
        this.timer = null;
        console.log("Video saved");
      }
    }
  }

  changeMedia(type: number) {
    this.chatSelector.flagCamera = type;
  }

  getTime() {
    let time = "";
    if (this.hours != 0) {
      if (this.hours < 10) {
        time += "0" + this.hours;
      }
      else {
        time += this.hours;
      }
      time += ":";
    }
    if (this.minutes < 10) {
      time += "0" + this.minutes;
    }
    else {
      time += this.minutes;
    }
    time += ":";
    if (this.seconds < 10) {
      time += "0" + this.seconds;
    }
    else {
      time += this.seconds;
    }
    return time;
  }
}
