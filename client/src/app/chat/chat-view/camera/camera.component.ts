import { Component, ViewChild, ElementRef } from '@angular/core';
import { ChatSelectorService } from '../../chat.service';
import { WebcamImage, WebcamInitError } from 'ngx-webcam';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-camera',
  templateUrl: './camera.component.html',
  styleUrls: ['./camera.component.css']
})
export class CameraComponent {
  @ViewChild("media_scrolling") media_scrolling!: ElementRef;

  constructor(public chatSelector: ChatSelectorService) { }

  seconds: number = 0;
  minutes: number = 0;
  hours: number = 0;
  timer: any = null;

  videoOnGoing: boolean = false;

  //trigger
  trigger: Subject<void> = new Subject<void>();

  //media
  media: { src: string, type: string }[] = [];

  video: MediaRecorder | null = null;

  //webcam snapshot trigger
  get $trigger() {
    return this.trigger.asObservable();
  }

  closeWebcam() {
    this.chatSelector.flagCamera = 0;
  }

  cameraProblem(event: WebcamInitError) {
    console.log(event);
  }

  takeMedia() {
    if (this.chatSelector.flagCamera == 1) {
      this.trigger.next();
    }
    else {
      if (!this.timer) {
        console.log("Video started");
        this.video = new MediaRecorder(this.chatSelector.stream as MediaStream);
        this.video.start();

        this.video.ondataavailable = (event) => {
          let recordedBlob: Blob = new Blob([event.data], { type: "video/webm" });
          let recordedSrc = URL.createObjectURL(recordedBlob);
          this.media.push({ src: recordedSrc, type: "video" });
          console.log("Video saved");
          console.log(this.media);
          this.showAllMedia()
        }

        console.log(this.media);
        this.seconds = this.minutes = this.hours = 0;
        this.videoOnGoing = true;
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
        this.video?.stop();



        this.videoOnGoing = false;
      }
    }
  }

  showAllMedia() {
    this.media_scrolling.nativeElement.innerHTML = "";
    for (let i = 0; i < this.media.length; i++) {
      let el = document.createElement(this.media[i].type);
      el.setAttribute("src", this.media[i].src);
      if(this.media[i].type == "video"){
        el.setAttribute("controls", "true");

      }
      this.media_scrolling.nativeElement.appendChild(el);
    }
  }


  changeMedia(type: number) {
    if (this.chatSelector.flagCamera == 2 && this.videoOnGoing) { //if video is on going and we cannot change the media
      return;
    }
    this.chatSelector.flagCamera = type;
  }

  /*PHOTO*/
  getImage(event: WebcamImage) {
    this.media.push({ src: event.imageAsDataUrl, type: "img" });
    console.log(this.media);
    this.showAllMedia();
  }


  /*VIDEO*/
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
