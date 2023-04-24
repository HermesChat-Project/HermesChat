import { Component, ViewChild, ElementRef, HostListener, ViewEncapsulation } from '@angular/core';
import { ChatSelectorService } from '../../chat.service';
import { WebcamImage, WebcamInitError } from 'ngx-webcam';
import { Subject } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-camera',
  templateUrl: './camera.component.html',
  styleUrls: ['./camera.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class CameraComponent {
  @ViewChild("media_scrolling") media_scrolling!: ElementRef;
  @ViewChild("media_changing") media_changing!: ElementRef;
  @ViewChild("container_webcam") container_webcam!: ElementRef;
  constructor(public chatSelector: ChatSelectorService, public sanitizer: DomSanitizer) {
    this.onResize();
  }

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

  width: number = 0;
  height: number = 0;

  media_position: number = 0;
  scroll_position: number = 0;

  seeMedia : string = "none";

  @HostListener('window:resize', ['$event'])
  onResize(event?: Event) {
    const win = !!event ? (event.target as Window) : window;
    console.log(win.innerWidth, win.innerHeight);
    this.width = win.innerWidth - 100;
    this.height = win.innerHeight - 100;
  }
  //webcam snapshot trigger
  get $trigger() {
    return this.trigger.asObservable();
  }

  closeWebcam() {
    this.chatSelector.stream?.getTracks().forEach(track => track.stop());
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
      let div = document.createElement("div")
      div.classList.add("media-item");
      this.media_scrolling.nativeElement.appendChild(div);
      let el = document.createElement(this.media[i].type);
      el.setAttribute("src", this.media[i].src);
      el.style.position = "relative";
      el.style.maxWidth = "640px";
      if (this.media[i].type == "video") {
        el.setAttribute("controls", "true");
        el.setAttribute("controlsList", "nodownload");
        el.setAttribute("controlsList", "nofullscreen");

      }
      div.appendChild(el);
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

  CheckIfShouldBeShown() {
    this.seeMedia = this.media.length != 0 ? "flex" : "none";
    if(this.media.length != 0){
      console.log(this.chatSelector.stream)
      this.chatSelector.stream?.getTracks().forEach(track => track.stop());
      this.container_webcam.nativeElement.style.display = "none";
    }
    return { "display": this.seeMedia };
  }

  getMedia(media: { src: string, type: string }) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(media.src);
  }

  changeMediaSelected(index: number) {
    console.log(index);
    let left = index * (-670) + "px";
    let keyFrames = [
      { transform: "translateX(" + this.media_position * (-670) + "px)" },
      { transform: "translateX(" + left + ")" }

    ];

    let keyFrames2 = [
      { transform: "translateX(" + this.scroll_position * (-71.66) + "px)" },
      { transform: "translateX(" + index * (-71.66) + "px)" }
    ];
    console.log(keyFrames2)
    let options: object = {
      duration: 200,
      iterations: 1,
      fill: "forwards",
      easing: "ease-in-out"
    }
    this.media_position = index;
    this.scroll_position = index
    this.media_scrolling.nativeElement.animate(keyFrames, options);
    this.media_changing.nativeElement.animate(keyFrames2, options);
  }
}
